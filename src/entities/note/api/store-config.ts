import { type DataStore, SchemaFieldType } from '@/shared/types/api';
import type { NoteData } from '../model/types';

const noteSchema: Record<Exclude<keyof NoteData, 'id' | 'tags'>, SchemaFieldType> = {
  created_at: SchemaFieldType.NOT_UNIQUE,
  title: SchemaFieldType.NOT_UNIQUE,
  text: SchemaFieldType.NOT_UNIQUE,
  reminder_date: SchemaFieldType.NOT_UNIQUE,
};

export const storeConfig: DataStore = {
  name: 'notes',
  primaryKey: 'id',
  schema: noteSchema,
};

export const relationConfig: DataStore = {
  name: 'note_tags',
  primaryKey: 'id',
  schema: {
    note_id: SchemaFieldType.NOT_UNIQUE,
    tag_id: SchemaFieldType.NOT_UNIQUE,
  },
  indexes: {
    noteId: {
      name: 'note_id_index',
      keyPath: 'note_id',
    },
    tagId: {
      name: 'tag_id_index',
      keyPath: 'tag_id',
    },
  },
};
