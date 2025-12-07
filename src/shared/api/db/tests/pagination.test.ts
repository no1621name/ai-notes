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

describe('DBClient: pagination, search', () => {
  let client: DBClient;
  let errorNotifier: DBErrorNotifier;

  beforeEach(async () => {
    const setup = createDbClient();
    client = setup.client;
    errorNotifier = setup.errorNotifier;
    await clearStore(client, STORE_NAME);
  });

  describe('basic pagination', () => {
    const createPaginationData = async () => {
      const items = Array.from({ length: 5 }, (_, i) =>
        createTestItem({
          id: `${i}`,
          name: `Item ${i}`,
          created_at: new Date(2025, 0, i + 1).toISOString(),
        }),
      );

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      return items;
    };

    it('should return first page of data', async () => {
      await createPaginationData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 2,
        order: 'asc',
        orderBy: 'created_at',
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('0');
      expect(result[1].id).toBe('1');
    });

    it('should return second page of data', async () => {
      await createPaginationData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 2,
        pageSize: 2,
        order: 'asc',
        orderBy: 'created_at',
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
    });

    it('should return partial page when not enough items', async () => {
      await createPaginationData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 3,
        pageSize: 2,
        order: 'asc',
        orderBy: 'created_at',
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('should return empty array when page exceeds data', async () => {
      await createPaginationData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 10,
        pageSize: 2,
        order: 'asc',
        orderBy: 'created_at',
      });

      expect(result).toHaveLength(0);
    });

    it('should respect pageSize parameter', async () => {
      await createPaginationData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 3,
        order: 'asc',
        orderBy: 'created_at',
      });

      expect(result).toHaveLength(3);
    });
  });

  describe('ordering', () => {
    const createOrderingData = async () => {
      const items = [
        createTestItem({ id: 'a', name: 'Zebra', created_at: '2025-12-03T00:00:00Z' }),
        createTestItem({ id: 'b', name: 'Apple', created_at: '2025-12-01T00:00:00Z' }),
        createTestItem({ id: 'c', name: 'Mango', created_at: '2025-12-02T00:00:00Z' }),
      ];

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      return items;
    };

    it('should order by ascending', async () => {
      await createOrderingData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'created_at',
      });

      expect(result[0].id).toBe('b');
      expect(result[1].id).toBe('c');
      expect(result[2].id).toBe('a');
    });

    it('should order by descending', async () => {
      await createOrderingData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'desc',
        orderBy: 'created_at',
      });

      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('c');
      expect(result[2].id).toBe('b');
    });

    it('should order by name field', async () => {
      await createOrderingData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'name',
      });

      expect(result[0].name).toBe('Apple');
      expect(result[1].name).toBe('Mango');
      expect(result[2].name).toBe('Zebra');
    });
  });

  describe('search functionality', () => {
    const createSearchData = async () => {
      const items = [
        createTestItem({ id: '1', name: 'Apple Pie', created_at: '2025-12-01T00:00:00Z' }),
        createTestItem({ id: '2', name: 'Banana Bread', created_at: '2025-12-02T00:00:00Z' }),
        createTestItem({ id: '3', name: 'Apple Juice', created_at: '2025-12-03T00:00:00Z' }),
        createTestItem({ id: '4', name: 'Orange Cake', created_at: '2025-12-04T00:00:00Z' }),
      ];

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      return items;
    };

    it('should filter data by search string', async () => {
      await createSearchData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'created_at',
        search: { text: 'apple', field: 'name' },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: '1', name: 'Apple Pie' });
      expect(result[1]).toMatchObject({ id: '3', name: 'Apple Juice' });
    });

    it('should perform case-insensitive search', async () => {
      const items = [
        createTestItem({ id: '1', name: 'APPLE PIE', created_at: '2025-12-01T00:00:00Z' }),
        createTestItem({ id: '2', name: 'apple juice', created_at: '2025-12-02T00:00:00Z' }),
        createTestItem({ id: '3', name: 'Apple Tart', created_at: '2025-12-03T00:00:00Z' }),
      ];

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'created_at',
        search: { text: 'ApPlE', field: 'name' },
      });

      expect(result).toHaveLength(3);
    });

    it('should combine search with pagination', async () => {
      await createSearchData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 2,
        pageSize: 1,
        order: 'asc',
        orderBy: 'created_at',
        search: { text: 'apple', field: 'name' },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: '3', name: 'Apple Juice' });
    });

    it('should return empty array when search finds no matches', async () => {
      await createSearchData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'created_at',
        search: { text: 'cherry', field: 'name' },
      });

      expect(result).toHaveLength(0);
    });

    it('should search partial matches', async () => {
      await createSearchData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'created_at',
        search: { text: 'an', field: 'name' },
      });

      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toContain('Banana Bread');
      expect(result.map(r => r.name)).toContain('Orange Cake');
    });

    it('should handle empty search text', async () => {
      await createSearchData();

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
        order: 'asc',
        orderBy: 'created_at',
        search: { text: '', field: 'name' },
      });

      expect(result).toHaveLength(4);
    });
  });

  describe('error cases', () => {
    it('should add error when orderBy field has no index', async () => {
      const item = createTestItem();
      await client.create(STORE_NAME, item);

      await expect(
        client.getPage(STORE_NAME, {
          page: 1,
          pageSize: 10,
          orderBy: 'nonExistentField',
        }),
      ).rejects.toBeUndefined();

      expect(errorNotifier.add).toHaveBeenCalledWith({
        title: 'No index',
        message: `Store ${STORE_NAME} has no index for field nonExistentField`,
        type: 'danger',
      });
    });
  });

  describe('default options', () => {
    it('should use default order desc when not specified', async () => {
      const items = [
        createTestItem({ id: '1', created_at: '2025-12-01T00:00:00Z' }),
        createTestItem({ id: '2', created_at: '2025-12-02T00:00:00Z' }),
      ];

      for (const item of items) {
        await client.create(STORE_NAME, item);
      }

      const result = await client.getPage<TestItem>(STORE_NAME, {
        page: 1,
        pageSize: 10,
      });

      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
    });
  });
});
