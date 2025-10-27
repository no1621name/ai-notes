import { useToasterStore } from '@/app/stores/toaster';
import {
  type PrimaryKeyType,
  type DataTransfer,
  type DataStore,
  SchemaFieldType,
} from '../../types/api';

interface DBConfig {
  name: string;
  version: number;
  stores: DataStore[];
}

export interface DBDataTransfer extends DataTransfer {
  getStores(storesNames: string[]): Promise<IDBObjectStore[]>;
}

export default class DBClient implements DBDataTransfer {
  private db: IDBDatabase | null = null;
  private toaster = useToasterStore();

  constructor(private config: DBConfig) { }

  private ERRORS_PAYLOAD = {
    invalidStoreName: {
      type: 'danger',
      title: 'Store error occured',
      message: 'Invalid store name',
    },
  } as const;

  private async connect() {
    return new Promise<void>((resolve, reject) => {
      if (!('indexedDB' in window)) {
        this.toaster.add({
          type: 'danger',
          title: 'DB error occured',
          message: 'IndexedDB is not supported in your browser',
        });
        reject();
      }

      const request = indexedDB.open(this.config.name, this.config.version);
      request.onerror = () => {
        this.toaster.add({
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
        indexes.forEach(indexConfig =>
          store.createIndex(indexConfig.name, indexConfig.keyPath, {
            unique: indexConfig.unique ?? false,
            multiEntry: indexConfig.multiEntry ?? false,
          }));
      }
    }
  }

  private async performRequest<R, I = object>(
    requestFn: () => IDBRequest<R> | undefined,
    storeName: string,
    item?: I,
  ) {
    if (!this.db) {
      await this.connect();
    }

    return new Promise<R>((resolve, reject) => {
      const storeConfig = this.config.stores.find(({ name }) => name === storeName);

      if (!this.db?.objectStoreNames.contains(storeName) || !storeConfig) {
        this.toaster.add(this.ERRORS_PAYLOAD.invalidStoreName);
        return reject();
      }

      if (!!item && !item?.[storeConfig.primaryKey as keyof I]) {
        this.toaster.add({
          type: 'danger',
          title: 'Store error occured',
          message: 'Missing primary key',
        });
        reject();
      }

      const request = requestFn();

      if (!request) {
        this.toaster.add({
          type: 'danger',
          title: 'Store error occured',
          message: 'Invalid request',
        });
        return reject();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => {
        this.toaster.add({
          type: 'danger',
          title: 'Request error occured',
          message: `IndexedDB request failed (${(event.target as IDBRequest).error?.message})`,
        });
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
    const request = () => {
      const objectStore = this.db?.transaction(store, 'readwrite').objectStore(store);

      return objectStore?.add(item) as IDBRequest<PrimaryKeyType> | undefined;
    };

    return this.performRequest(request, store, item);
  }

  public update<T>(store: string, item: T) {
    const request = () => {
      const objectStore = this.db?.transaction(store, 'readwrite').objectStore(store);

      return objectStore?.put(item) as IDBRequest<PrimaryKeyType> | undefined;
    };

    return this.performRequest(request, store, item);
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
        this.toaster.add(this.ERRORS_PAYLOAD.invalidStoreName);
        return reject();
      }

      const transaction = this.db?.transaction(storesNames);

      resolve(
        storesNames
          .map(name => transaction?.objectStore(name))
          .filter(store => typeof store !== 'undefined'),
      );
    });
  }
}
