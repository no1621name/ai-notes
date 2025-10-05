import { type DataStore, SchemaFieldType } from '@/shared/types/api';
import type { Note } from '../model/interface';

const noteSchema: Record<Exclude<keyof Note, 'id'>, SchemaFieldType> = {
  created_at: SchemaFieldType.NOT_UNIQUE,
  name: SchemaFieldType.UNIQUE,
};

export const storeConfig: DataStore = {
  name: 'notes',
  primaryKey: 'id',
  schema: noteSchema,
};
