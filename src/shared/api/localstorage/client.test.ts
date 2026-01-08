import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LocalStorageClient from './client';
import type { ErrorNotifier } from '@/shared/api/errors/error-notifier';

type PrimaryKeyType = string | number;

interface TestItem {
  id: PrimaryKeyType;
  name: string;
}

type MockedErrorNotifier = {
  add: ReturnType<typeof vi.fn>;
  duplicateItem: ReturnType<typeof vi.fn>;
  itemNotFound: ReturnType<typeof vi.fn>;
  missingIdForUpdate: ReturnType<typeof vi.fn>;
};

describe('LocalStorageClient', () => {
  let client: LocalStorageClient;
  let mockErrorNotifier: MockedErrorNotifier;
  let mockLocalStorage: {
    getItem: ReturnType<typeof vi.fn<(key: string) => string | null>>;
    setItem: ReturnType<typeof vi.fn<(key: string, value: string) => void>>;
    clear: ReturnType<typeof vi.fn<() => void>>;
    getStore: () => Record<string, string>;
  };
  const storeName = 'testStore';

  beforeEach(() => {
    let store: Record<string, string> = {};
    mockLocalStorage = {
      getItem: vi.fn(key => store[key] ?? null),
      setItem: vi.fn((key, value) => {
        store[key] = String(value);
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      getStore: () => store,
    };

    mockErrorNotifier = {
      add: vi.fn(),
      duplicateItem: vi.fn(),
      itemNotFound: vi.fn(),
      missingIdForUpdate: vi.fn(),
    };

    const localStorageMock = {
      getItem: mockLocalStorage.getItem,
      setItem: mockLocalStorage.setItem,
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };

    vi.stubGlobal('localStorage', localStorageMock);

    client = new LocalStorageClient(mockErrorNotifier as unknown as ErrorNotifier, 'test', 'id');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('common errors', () => {
    it('should throw error and notify about localhost read error when getting item(s)', async () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Corrupted data');
      });

      await expect(client.getById<TestItem>(storeName, '1')).rejects.toThrow();
      expect(mockErrorNotifier.add).toHaveBeenCalledWith({
        type: 'danger',
        title: 'Storage read error',
        message: `Failed to read data from store "${storeName}"`,
      });
    });

    it('should throw error and notify about localhost write error when writing item', async () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Corrupted data');
      });

      await expect(client.create<TestItem>(storeName, { id: '1', name: 'Bob' })).rejects.toThrow();
      expect(mockErrorNotifier.add).toHaveBeenCalledWith({
        type: 'danger',
        title: 'Storage write error',
        message: `Failed to save data to store "${storeName}"`,
      });
    });
  });

  describe('read - getById', () => {
    it('should notify and throw error when item not found in getById', async () => {
      await expect(client.getById<TestItem>(storeName, '1')).rejects.toThrow();
    });

    it('should return item data when found in getById', async () => {
      const item = { id: '1', name: 'Alice' };
      mockLocalStorage.setItem('test:testStore', JSON.stringify([{ id: '1', data: item }]));

      const result = await client.getById<TestItem>(storeName, '1');
      expect(result).toEqual(item);
    });
  });

  describe('read - getAll', () => {
    it('should return empty array when store is empty in getAll', async () => {
      const result = await client.getAll<TestItem>(storeName);
      expect(result).toEqual([]);
    });

    it('should return all items in getAll', async () => {
      const items = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];
      mockLocalStorage.setItem(
        'test:testStore',
        JSON.stringify(items.map(data => ({ id: data.id, data }))),
      );

      const result = await client.getAll<TestItem>(storeName);
      expect(result).toEqual(items);
    });
  });

  describe('create', () => {
    it('should create item with provided id and return it', async () => {
      const item = { id: '100', name: 'Charlie' };
      const id = await client.create<TestItem>(storeName, item);

      expect(id).toBe('100');
      const stored = JSON.parse(mockLocalStorage.getItem('test:testStore')!);
      expect(stored).toEqual([{ id: '100', data: item }]);
      expect(mockErrorNotifier.duplicateItem).not.toHaveBeenCalled();
    });

    it('should generate id if not provided and return it', async () => {
      const item = { name: 'Charlie' };
      const id = await client.create<{ name: string; id?: string }>(storeName, item);

      expect(typeof id).toBe('string');
      expect(id).toMatch(/^\d+-[a-z0-9]{1,9}$/);

      const stored = JSON.parse(mockLocalStorage.getItem('test:testStore')!);
      expect(stored).toEqual([{ id, data: { id, name: 'Charlie' } }]);
    });

    it('should notify and throw error when creating item with duplicate id', async () => {
      const item1 = { id: 'dup', name: 'First' };
      await client.create<TestItem>(storeName, item1);

      const item2 = { id: 'dup', name: 'Second' };
      await expect(client.create<TestItem>(storeName, item2)).rejects.toThrow(
        'Item with id dup already exists in store testStore',
      );
      expect(mockErrorNotifier.duplicateItem).toHaveBeenCalledWith('dup', storeName);
    });
  });

  describe('update', () => {
    it('should update existing item and return its id', async () => {
      const original = { id: '5', name: 'Old' };
      await client.create<TestItem>(storeName, original);

      const updated = { id: '5', name: 'New' };
      const response = await client.update<TestItem>(storeName, updated);

      expect(response).toEqual(updated);
      const stored = JSON.parse(mockLocalStorage.getItem('test:testStore')!);
      expect(stored).toEqual([{ id: '5', data: updated }]);
    });

    it('should notify and throw error when updating item without id', async () => {
      const item = { name: 'NoId' };
      await expect(client.update(storeName, item)).rejects.toThrow(
        'Item must have an id field to be updated',
      );
      expect(mockErrorNotifier.missingIdForUpdate).toHaveBeenCalled();
    });

    it('should notify and throw error when updating non-existent item', async () => {
      const item = { id: 'missing', name: 'Ghost' };
      await expect(client.update<TestItem>(storeName, item)).rejects.toThrow(
        'Item with id missing not found in store testStore',
      );
      expect(mockErrorNotifier.itemNotFound).toHaveBeenCalledWith('missing', storeName);
    });
  });

  describe('delete', () => {
    it('should delete existing item', async () => {
      await client.create<TestItem>(storeName, { id: 'del', name: 'ToBeDeleted' });
      await client.delete(storeName, 'del');

      const stored = JSON.parse(mockLocalStorage.getItem('test:testStore')!);
      expect(stored).toEqual([]);
    });

    it('should notify and throw error when deleting non-existent item', async () => {
      await expect(client.delete(storeName, 'nonexistent')).rejects.toThrow(
        'Item with id nonexistent not found in store testStore',
      );
      expect(mockErrorNotifier.itemNotFound).toHaveBeenCalledWith('nonexistent', storeName);
    });
  });
});
