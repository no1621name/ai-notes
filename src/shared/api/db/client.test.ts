import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useToasterStore } from '@/app/stores/toaster';
import DBClient from './client';
import { SchemaFieldType } from '../../types/api';

type RequestHandler = null | ((ev: unknown) => void);
type IDBRequestType = Record<'onsuccess' | 'onerror', RequestHandler>;

describe('IDBClient', () => {
  let request: IDBRequestType;
  let toasterStore: ReturnType<typeof useToasterStore>;

  const mockIndexedDB = {
    open: vi.fn(),
  };

  const dbConfig = {
    name: 'testDB',
    version: 1,
    stores: [
      {
        name: 'testStore',
        primaryKey: 'id',
        schema: {
          id: SchemaFieldType.UNIQUE,
          name: SchemaFieldType.NOT_UNIQUE,
        },
      },
    ],
  };

  beforeEach(() => {
    createTestingPinia({
      createSpy: vi.fn,
    });
    toasterStore = useToasterStore();

    global.indexedDB = mockIndexedDB as unknown as never;

    request = {
      onsuccess: null,
      onerror: null,
    };
    mockIndexedDB.open.mockReturnValue(request);
    vi.clearAllMocks();
  });

  it('should add error to toaster when IndexedDB is not supported', async () => {
    delete (window as { indexedDB: unknown }).indexedDB;
    const dbClient = new DBClient(dbConfig);

    await expect(dbClient.getAll('testStore')).rejects.toBeUndefined();

    expect(toasterStore.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'DB error occured',
      message: 'IndexedDB is not supported in your browser',
    });
  });

  it('should add error to toaster when IndexedDB fails to open', async () => {
    const dbClient = new DBClient(dbConfig);
    const errorHandler = vi.fn();
    mockIndexedDB.open.mockImplementation(() => {
      const request = {
        onerror: errorHandler,
        onsuccess: null,
        onupgradeneeded: null,
      };
      setTimeout(() => request.onerror?.(), 0);
      return request;
    });

    await expect(dbClient.getAll('testStore')).rejects.toBeUndefined();

    expect(toasterStore.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'DB error occured',
      message: 'IndexedDB failed to open',
    });
  });

  it('should add error to toaster when store name is invalid', async () => {
    const dbClient = new DBClient(dbConfig);

    setTimeout(() => {
      request.onsuccess?.({
        target: {
          result: {
            objectStoreNames: {
              contains: vi.fn().mockReturnValue(false),
            },
            transaction: vi.fn(),
          },
        },
      });
    }, 0);

    await expect(dbClient.getAll('invalidStore')).rejects.toBeUndefined();

    expect(toasterStore.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'Store error occured',
      message: 'Invalid store name',
    });
  });

  it('should add error to toaster when primary key is missing in create', async () => {
    const dbClient = new DBClient(dbConfig);

    setTimeout(() => {
      request.onsuccess?.({
        target: {
          result: {
            objectStoreNames: { contains: () => true },
            transaction: vi.fn().mockReturnValue({
              objectStore: vi.fn().mockReturnValue({
                add: vi.fn(),
              }),
            }),
          },
        },
      });
    }, 0);

    await expect(dbClient.create('testStore', { name: 'Test' })).rejects.toBeUndefined();

    expect(toasterStore.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'Store error occured',
      message: 'Missing primary key',
    });
  });

  it('should add error to toaster when request fails', async () => {
    const mockError = new Error('Request failed');
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          get: vi.fn().mockReturnValue({
            onsuccess: null,
            onerror: null,
          } as IDBRequestType),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const getRequest = mockDB.transaction().objectStore().get();
      setTimeout(() => getRequest.onerror?.({ target: { error: mockError } }), 0);
    }, 0);

    await expect(dbClient.getById('testStore', '1')).rejects.toBeUndefined();

    expect(toasterStore.add).toHaveBeenCalledWith({
      type: 'danger',
      title: 'Request error occured',
      message: `IndexedDB request failed (${mockError.message})`,
    });
  });

  it('should successfully get data by ID', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockDB = {
      objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          get: vi.fn().mockReturnValue({
            onsuccess: null,
            onerror: null,
          } as IDBRequestType),
        }),
      }),
      close: vi.fn(),
    };

    const dbClient = new DBClient(dbConfig);

    setTimeout(() => {
      request.onsuccess?.({ target: { result: mockDB } });
      const getRequest = mockDB.transaction().objectStore().get();
      setTimeout(() => {
        getRequest.result = mockData;
        getRequest.onsuccess?.();
      }, 0);
    }, 0);
    const result = await dbClient.getById('testStore', '1');

    expect(result).toEqual(mockData);
    expect(toasterStore.add).not.toHaveBeenCalled();
  });
});
