import type { SavedPrompt } from '../../../model/types';
import { SchemaFieldType, type DataStore } from '@/shared/types/api';

const savedPromptSchema: Record<keyof Omit<SavedPrompt, 'id'>, SchemaFieldType> = {
  name: SchemaFieldType.NOT_UNIQUE,
  prompt: SchemaFieldType.NOT_UNIQUE,
  created_at: SchemaFieldType.NOT_UNIQUE,
};

export const storeConfig: DataStore = {
  name: 'saved_prompts',
  primaryKey: 'id',
  schema: savedPromptSchema,
  indexes: {
    created_at: {
      keyPath: 'created_at',
      name: 'created_at_index',
    },
  },
};
