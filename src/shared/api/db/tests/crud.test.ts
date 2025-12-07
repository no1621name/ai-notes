import { describe, it, expect, beforeEach } from 'vitest';

import {
  createDbClient,
  createTestItem,
  clearStore,
  STORE_NAME,
  type TestItem,
} from './mocks';
import type DBClient from '../client';
import type { DBErrorNotifier } from '../client';

describe('DBClient: crud', () => {
  let client: DBClient;
  let errorNotifier: DBErrorNotifier;

  beforeEach(async () => {
    const setup = createDbClient();
    client = setup.client;
    errorNotifier = setup.errorNotifier;
    await clearStore(client, STORE_NAME);
  });

  describe('create', () => {
    it('should successfully create an item and return primary key', async () => {
      const item = createTestItem({ id: 'test-1', name: 'Test Item' });
      const key = await client.create(STORE_NAME, item);

      expect(key).toBe('test-1');
      expect(errorNotifier.add).not.toHaveBeenCalled();
      expect(errorNotifier.requestFailed).not.toHaveBeenCalled();
    });

    it('should auto-generate id if not provided', async () => {
      const item = { name: 'No id', created_at: new Date().toISOString() };
      const key = await client.create(STORE_NAME, item);

      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect((key as string).length).toBeGreaterThan(0);
    });

    it('should store the complete item data', async () => {
      const item = createTestItem({ id: 'complete-data', name: 'Complete Test' });
      await client.create(STORE_NAME, item);

      const retrieved = await client.getById<TestItem>(STORE_NAME, 'complete-data');
      expect(retrieved).toEqual(item);
    });
  });

  describe('read - getById', () => {
    it('should successfully get data by id', async () => {
      const item = createTestItem({ id: 'read-1', name: 'Read Test' });
      await client.create(STORE_NAME, item);

      const result = await client.getById<TestItem>(STORE_NAME, 'read-1');

      expect(result).toEqual(item);
      expect(errorNotifier.add).not.toHaveBeenCalled();
      expect(errorNotifier.requestFailed).not.toHaveBeenCalled();
    });

    it('should return undefined for non-existent id', async () => {
      const result = await client.getById<TestItem>(STORE_NAME, 'non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('read - getAll', () => {
    it('should successfully get all items', async () => {
      const items = [
        createTestItem({ id: 'all-1', name: 'Item 1' }),
        createTestItem({ id: 'all-2', name: 'Item 2' }),
      ];

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      const result = await client.getAll<TestItem>(STORE_NAME);

      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(items));
      expect(errorNotifier.add).not.toHaveBeenCalled();
      expect(errorNotifier.requestFailed).not.toHaveBeenCalled();
    });

    it('should return empty array when store is empty', async () => {
      const result = await client.getAll<TestItem>(STORE_NAME);
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should successfully update an item with merge', async () => {
      const original = createTestItem({
        id: 'update-1',
        name: 'Original Name',
        created_at: '2025-12-01T00:00:00Z',
      });
      await client.create(STORE_NAME, original);

      const updated = await client.update<TestItem>(STORE_NAME, {
        id: 'update-1',
        name: 'Updated Name',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.created_at).toBe('2025-12-01T00:00:00Z');
      expect(errorNotifier.add).not.toHaveBeenCalled();
      expect(errorNotifier.requestFailed).not.toHaveBeenCalled();
    });

    it('should persist updated data', async () => {
      const original = createTestItem({ id: 'persist-1', name: 'Original' });
      await client.create(STORE_NAME, original);

      await client.update<TestItem>(STORE_NAME, {
        id: 'persist-1',
        name: 'Persisted Update',
      });

      const retrieved = await client.getById<TestItem>(STORE_NAME, 'persist-1');
      expect(retrieved?.name).toBe('Persisted Update');
    });

    it('should reject with error when updating non-existent item', async () => {
      const nonExistent = createTestItem({ id: 'non-existent' });

      await expect(
        client.update<TestItem>(STORE_NAME, nonExistent),
      ).rejects.toThrow('Item not found');
    });

    it('should add error notification when missing primary key in update', async () => {
      const itemWithoutId = { name: 'No id' } as Partial<TestItem>;

      await expect(client.update<TestItem>(STORE_NAME, itemWithoutId)).rejects.toBeUndefined();
      expect(errorNotifier.missingPrimaryKey).toHaveBeenCalled();
    });

    it('should handle updating with undefined values', async () => {
      const original = createTestItem({
        id: 'undefined-1',
        name: 'Original Name',
      });
      await client.create(STORE_NAME, original);

      const updated = await client.update<TestItem>(STORE_NAME, {
        id: 'undefined-1',
        name: undefined,
      } as Partial<TestItem>);

      expect(updated.name).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should successfully delete an item', async () => {
      const item = createTestItem({ id: 'delete-1' });
      await client.create(STORE_NAME, item);

      await expect(client.delete(STORE_NAME, 'delete-1')).resolves.toBeUndefined();

      const result = await client.getById<TestItem>(STORE_NAME, 'delete-1');
      expect(result).toBeUndefined();
      expect(errorNotifier.add).not.toHaveBeenCalled();
      expect(errorNotifier.requestFailed).not.toHaveBeenCalled();
    });

    it('should not error when deleting non-existent item', async () => {
      await expect(client.delete(STORE_NAME, 'non-existent')).resolves.toBeUndefined();
    });

    it('should only delete the specified item', async () => {
      const items = [
        createTestItem({ id: 'keep-1' }),
        createTestItem({ id: 'delete-me' }),
        createTestItem({ id: 'keep-2' }),
      ];

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      await client.delete(STORE_NAME, 'delete-me');

      const remaining = await client.getAll<TestItem>(STORE_NAME);
      expect(remaining).toHaveLength(2);
      expect(remaining.map(r => r.id)).toEqual(expect.arrayContaining(['keep-1', 'keep-2']));
    });
  });
});
