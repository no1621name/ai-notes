import { vi } from 'vitest';

import { SchemaFieldType, type DataStore } from '@/shared/types/api';
import DBClient, { type DBErrorNotifier } from '../client';

export interface TestItem {
  id: string;
  name: string;
  created_at: string;
}

export const testStoreConfig: DataStore = {
  name: 'testStore',
  primaryKey: 'id',
  schema: {
    id: SchemaFieldType.UNIQUE,
    name: SchemaFieldType.NOT_UNIQUE,
    created_at: SchemaFieldType.NOT_UNIQUE,
  },
  indexes: {
    name: {
      name: 'name_index',
      keyPath: 'name',
    },
    created_at: {
      name: 'created_at_index',
      keyPath: 'created_at',
    },
  },
};

export const storeWithoutCreatedAtIndex: DataStore = {
  name: 'storeWithoutIndex',
  primaryKey: 'id',
  schema: {
    id: SchemaFieldType.UNIQUE,
    name: SchemaFieldType.NOT_UNIQUE,
  },
};

let dbVersion = 1;

export const createDbConfig = () => ({
  name: `testDB_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  version: dbVersion++,
  stores: [testStoreConfig, storeWithoutCreatedAtIndex],
});

export const createMockErrorNotifier = (): DBErrorNotifier => ({
  add: vi.fn(),
  invalidStoreName: vi.fn(),
  missingPrimaryKey: vi.fn(),
  requestFailed: vi.fn(),
});

export const createDbClient = (errorNotifier?: DBErrorNotifier) => {
  const notifier = errorNotifier ?? createMockErrorNotifier();
  return {
    client: new DBClient(createDbConfig(), notifier),
    errorNotifier: notifier,
  };
};

export const clearStore = async (client: DBClient, storeName: string) => {
  try {
    const allItems = await client.getAll<TestItem>(storeName);
    await Promise.all(allItems.map(item => client.delete(storeName, item.id)));
  } catch {
  }
};

export const createTestItem = (overrides: Partial<TestItem> = {}): TestItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  name: 'Test Item',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createTestItems = (count: number, namePrefix = 'Item'): TestItem[] => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    id: `item_${i}`,
    name: `${namePrefix} ${i}`,
    created_at: new Date(now + i * 1000).toISOString(),
  }));
};

export const STORE_NAME = testStoreConfig.name;
export const STORE_WITHOUT_INDEX = storeWithoutCreatedAtIndex.name;
