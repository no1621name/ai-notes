export enum SchemaFieldType {
  UNIQUE,
  NOT_UNIQUE,
}

export type PrimaryKeyType = string;

export interface DataTransfer {
  getById<T>(store: string, id: PrimaryKeyType): Promise<T | undefined>;
  getAll<T>(store: string): Promise<T[]>;
  create<T>(store: string, item: T): Promise<PrimaryKeyType>;
  update<T>(store: string, item: T): Promise<PrimaryKeyType>;
  delete(store: string, id: PrimaryKeyType): Promise<void>;
}

export interface DataStore {
  name: string;
  primaryKey: string;
  schema: Record<string, SchemaFieldType>;
}

const getA = async (client: DataTransfer) => {
  const notes = await client.getAll<{ id: PrimaryKeyType; name: string }>('notes');
  return notes;
};

// class A {
//   constructor(private transfer: DataTransfer) {}
// }
