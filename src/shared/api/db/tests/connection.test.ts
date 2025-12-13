import { describe, it, expect, beforeEach } from 'vitest';

import {
  createDbClient,
  createTestItem,
  STORE_NAME,
} from './mocks';
import type DBClient from '../client';
import type { DBErrorNotifier } from '../client';

describe('DBClient: connection', () => {
  let client: DBClient;
  let errorNotifier: DBErrorNotifier;

  beforeEach(() => {
    const setup = createDbClient();
    client = setup.client;
    errorNotifier = setup.errorNotifier;
  });

  describe('store validation', () => {
    it('should add error notification when store name is invalid', async () => {
      await expect(client.getAll('invalidStore')).rejects.toBeUndefined();
      expect(errorNotifier.invalidStoreName).toHaveBeenCalled();
    });

    it('should add error notification when one of multiple store names is invalid', async () => {
      await expect(client.getStores(['invalidStore'])).rejects.toBeUndefined();
      expect(errorNotifier.invalidStoreName).toHaveBeenCalled();
    });

    it('should return array of object stores when store names are valid', async () => {
      const stores = await client.getStores([STORE_NAME]);
      expect(Array.isArray(stores)).toBe(true);
      expect(stores).toHaveLength(1);
    });

    it('should support multiple valid store names', async () => {
      const stores = await client.getStores([STORE_NAME, 'storeWithoutIndex']);
      expect(stores).toHaveLength(2);
    });
  });

  describe('primary key handling', () => {
    it('should auto-generate id when primary key is not provided in create', async () => {
      const itemWithoutId = { name: 'Test', created_at: new Date().toISOString() };
      const key = await client.create(STORE_NAME, itemWithoutId);

      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
    });

    it('should use provided primary key when creating item', async () => {
      const item = createTestItem({ id: 'custom-id-123' });
      const key = await client.create(STORE_NAME, item);

      expect(key).toBe('custom-id-123');
    });
  });

  describe('error notifications', () => {
    it('should notify error when getById uses invalid store', async () => {
      await expect(client.getById('invalidStore', '1')).rejects.toBeUndefined();
      expect(errorNotifier.invalidStoreName).toHaveBeenCalled();
    });

    it('should notify error when create uses invalid store', async () => {
      const item = createTestItem();
      await expect(client.create('invalidStore', item)).rejects.toBeUndefined();
      expect(errorNotifier.invalidStoreName).toHaveBeenCalled();
    });

    it('should notify error when update uses invalid store', async () => {
      const item = createTestItem();
      await expect(client.update('invalidStore', item)).rejects.toBeUndefined();
      expect(errorNotifier.invalidStoreName).toHaveBeenCalled();
    });

    it('should notify error when delete uses invalid store', async () => {
      await expect(client.delete('invalidStore', '1')).rejects.toBeUndefined();
      expect(errorNotifier.invalidStoreName).toHaveBeenCalled();
    });
  });
});
