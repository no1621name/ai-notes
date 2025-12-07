export enum SchemaFieldType {
  UNIQUE,
  NOT_UNIQUE,
}

export type PrimaryKeyType = string;

export interface DataTransfer {
  getById<T>(store: string, id: PrimaryKeyType): Promise<T | undefined>;
  getAll<T>(store: string): Promise<T[]>;
  create<T>(store: string, item: T): Promise<PrimaryKeyType>;
  update<T>(store: string, item: Partial<T>): Promise<T>;
  delete(store: string, id: PrimaryKeyType): Promise<void>;
}

interface StoreIndex {
  name: string;
  keyPath: string;
  unique?: boolean;
  multiEntry?: boolean;
}

export interface DataStore {
  name: string;
  primaryKey: string;
  schema: Record<string, SchemaFieldType>;
  indexes?: Record<string, StoreIndex>;
}
