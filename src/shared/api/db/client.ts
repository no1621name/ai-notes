import { v4 } from 'uuid';

import {
  type PrimaryKeyType,
  type DataTransfer,
  type DataStore,
  SchemaFieldType,
} from '../../types/api';
import { ErrorNotifier } from '../errors/error-notifier';

interface DBConfig {
  name: string;
  version: number;
  stores: DataStore[];
}

export interface DBDataTransfer extends DataTransfer {
  getStores(storesNames: string[]): Promise<IDBObjectStore[]>;
  getAllByCreatedAt<T>(storeName: string): Promise<T[]>;
}

export default class DBClient implements DBDataTransfer {
  private db: IDBDatabase | null = null;

  constructor(private config: DBConfig, private errorNotifier: ErrorNotifier) { }

  private async connect() {
    return new Promise<void>((resolve, reject) => {
      if (!('indexedDB' in window)) {
        this.errorNotifier.add({
          type: 'danger',
          title: 'DB error occured',
          message: 'IndexedDB is not supported in your browser',
        });
        reject();
      }

      const request = indexedDB.open(this.config.name, this.config.version);
      request.onerror = () => {
        this.errorNotifier.add({
          type: 'danger',
          title: 'DB error occured',
          message: 'IndexedDB failed to open',
        });
        reject();
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createDB(db);
      };
    });
  }

  private createDB(db: IDBDatabase) {
    for (const storeInfo of this.config.stores) {
      if (db.objectStoreNames.contains(storeInfo.name)) {
        continue;
      }

      const store = db.createObjectStore(storeInfo.name, { keyPath: storeInfo.primaryKey });

      const fields = Object.keys(storeInfo.schema);

      if (fields.length) {
        fields
          .filter(field => field !== storeInfo.primaryKey)
          .forEach(field =>
            store.createIndex(field, field, {
              unique: storeInfo.schema[field] === SchemaFieldType.UNIQUE,
            }),
          );
      }

      const indexes = Object.values(storeInfo.indexes ?? []);
      if (indexes && indexes.length) {
        indexes.forEach((indexConfig) => {
          if (!store.indexNames.contains(indexConfig.name)) {
            store.createIndex(indexConfig.name, indexConfig.keyPath, {
              unique: indexConfig.unique ?? false,
              multiEntry: indexConfig.multiEntry ?? false,
            });
          }
        });
      }
    }
  }

  private async performRequest<R, I = object>(
    requestFn: () => IDBRequest<R> | Promise<IDBRequest<R>> | undefined,
    storeName: string,
    item?: I,
  ) {
    if (!this.db) {
      await this.connect();
    }

    return new Promise<R>(async (resolve, reject) => {
      const storeConfig = this.config.stores.find(({ name }) => name === storeName);

      if (!this.db?.objectStoreNames.contains(storeName) || !storeConfig) {
        this.errorNotifier.invalidStoreName();
        return reject();
      }

      if (!!item && !item?.[storeConfig.primaryKey as keyof I]) {
        this.errorNotifier.missingPrimaryKey();
        reject();
      }

      const request = await requestFn();

      if (!request) {
        this.errorNotifier.requestFailed();
        return reject();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => {
        this.errorNotifier.requestFailed((event.target as IDBRequest).error);
        reject();
      };
    });
  }

  public getById<T>(store: string, id: PrimaryKeyType) {
    return this.performRequest<T>(
      () => this.db?.transaction(store, 'readonly').objectStore(store).get(id),
      store,
    );
  }

  public getAll<T>(store: string) {
    return this.performRequest<T[]>(
      () => this.db?.transaction(store, 'readonly').objectStore(store).getAll(),
      store,
    );
  }

  public create<T>(store: string, item: T) {
    if (typeof item === 'object' && item !== null && !('id' in item)) {
      (item as unknown as { id: string }).id = v4();
    }

    const request = () => {
      const objectStore = this.db?.transaction(store, 'readwrite').objectStore(store);

      return objectStore?.add(item) as IDBRequest<PrimaryKeyType> | undefined;
    };

    return this.performRequest(request, store, item);
  }

  public async update<T>(store: string, item: Partial<T>) {
    if (!this.db) {
      await this.connect();
    }

    return new Promise<T>((resolve, reject) => {
      const storeConfig = this.config.stores.find(({ name }) => name === store);

      if (!this.db?.objectStoreNames.contains(store) || !storeConfig) {
        this.errorNotifier.invalidStoreName();
        return reject();
      }

      if (!!item && !item?.[storeConfig.primaryKey as keyof Partial<T>]) {
        this.errorNotifier.missingPrimaryKey();
        reject();
      }

      const transaction = this.db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);

      const getRequest = objectStore.get((item as { [key: typeof storeConfig.primaryKey]: PrimaryKeyType })[storeConfig.primaryKey]);

      getRequest.onsuccess = () => {
        const existing = getRequest.result;

        if (!existing) {
          reject(new Error('Item not found'));
          return;
        }

        const newItem = { ...existing, ...item };
        const putRequest = objectStore.put(newItem);

        putRequest.onsuccess = () => resolve(newItem);
        putRequest.onerror = (event) => {
          const target = event.target as IDBRequest;
          this.errorNotifier.requestFailed(target.error);
          reject();
        };
      };

      getRequest.onerror = (event) => {
        const target = event.target as IDBRequest;
        this.errorNotifier.requestFailed(target.error);
        reject();
      };
    });
  }

  public delete(store: string, id: PrimaryKeyType) {
    return this.performRequest(
      () => this.db?.transaction(store, 'readwrite').objectStore(store).delete(id),
      store,
    );
  }

  public async getStores(storesNames: string[]) {
    if (!this.db) {
      await this.connect();
    }

    return new Promise<IDBObjectStore[]>((resolve, reject) => {
      if (storesNames.some(name => !this.db?.objectStoreNames.contains(name))) {
        this.errorNotifier.invalidStoreName();
        return reject();
      }

      const transaction = this.db?.transaction(storesNames, 'readwrite');

      resolve(
        storesNames
          .map(name => transaction?.objectStore(name))
          .filter(store => typeof store !== 'undefined'),
      );
    });
  }

  public async getAllByCreatedAt<T>(storeName: string) {
    if (!this.db) {
      await this.connect();
    }

    return new Promise<T[]>((resolve, reject) => {
      const storeConfig = this.config.stores.find(({ name }) => name === storeName);

      if (!this.db?.objectStoreNames.contains(storeName) || !storeConfig) {
        this.errorNotifier.invalidStoreName();
        return reject();
      }

      if (!storeConfig.indexes?.created_at) {
        this.errorNotifier.add({
          title: 'No index',
          message: 'This store could not be indexed by created date',
          type: 'danger',
        });

        return reject();
      }

      const store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
      const index = store.index(storeConfig.indexes.created_at.name);

      const result: T[] = [];
      const request = index.openCursor(null, 'next');

      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}
