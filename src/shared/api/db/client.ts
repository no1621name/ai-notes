import { v4 } from 'uuid';

import {
  type PrimaryKeyType,
  type DataTransfer,
  type DataStore,
  SchemaFieldType,
} from '../../types/api';

export interface DBConfig {
  name: string;
  version: number;
  stores: DataStore[];
}

interface DBErrorBody {
  type: 'danger';
  title: string;
  message: string;
}

export interface DBErrorNotifier {
  add: (error: DBErrorBody) => void;
  invalidStoreName: () => void;
  missingPrimaryKey: () => void;
  requestFailed: (error?: DOMException | null) => void;
}

export interface DBDataTransfer extends DataTransfer {
  getStores(storesNames: string[]): Promise<IDBObjectStore[]>;
}

export default class DBClient implements DBDataTransfer {
  private db: IDBDatabase | null = null;

  constructor(private config: DBConfig, private errorNotifier: DBErrorNotifier) {}

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
        this.createDB(db, (event.target as IDBRequest).transaction);
      };
    });
  }

  private createDB(db: IDBDatabase, transaction: IDBTransaction | null) {
    for (const storeInfo of this.config.stores) {
      let store: IDBObjectStore | null = null;

      if (db.objectStoreNames.contains(storeInfo.name) && transaction) {
        store = transaction?.objectStore(storeInfo.name);
      } else {
        store = db.createObjectStore(storeInfo.name, { keyPath: storeInfo.primaryKey });
      }

      const fields = Object.keys(storeInfo.schema);

      if (fields.length) {
        fields
          .filter(field => field !== storeInfo.primaryKey)
          .forEach((field) => {
            if (!store.indexNames.contains(field)) {
              store.createIndex(field, field, {
                unique: storeInfo.schema[field] === SchemaFieldType.UNIQUE,
              });
            }
          });
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

      request.onsuccess = () => {
        resolve(request.result);
      };
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

      const primaryKey = item?.[storeConfig.primaryKey as keyof Partial<T>];

      if (!primaryKey) {
        this.errorNotifier.missingPrimaryKey();
        return reject();
      }

      const transaction = this.db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);

      const getRequest = objectStore.get(primaryKey as IDBValidKey);

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
}
