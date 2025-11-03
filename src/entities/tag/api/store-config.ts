import { type DataStore, SchemaFieldType } from '@/shared/types/api';

const tagSchema = {
  name: SchemaFieldType.NOT_UNIQUE,
  color: SchemaFieldType.NOT_UNIQUE,
  created_at: SchemaFieldType.NOT_UNIQUE,
};

export const storeConfig: DataStore = {
  name: 'tags',
  primaryKey: 'id',
  schema: tagSchema,
  indexes: {
    created_at: {
      name: 'created_at',
      keyPath: 'created_at',
    },
  },
};
