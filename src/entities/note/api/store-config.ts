import { tagsStoreConfig } from '@/entities/tag/@x/note';
import type { ManyToManyRelationConfig } from '@/shared/api/db/relations/many-to-many';
import { type DataStore, SchemaFieldType } from '@/shared/types/api';
import type { NoteData } from '../model/types';

const noteSchema: Record<Exclude<keyof NoteData, 'id' | 'tags'>, SchemaFieldType> = {
  created_at: SchemaFieldType.NOT_UNIQUE,
  updated_at: SchemaFieldType.NOT_UNIQUE,
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
    note_id: {
      name: 'note_id_index',
      keyPath: 'note_id',
    },
    tag_id: {
      name: 'tag_id_index',
      keyPath: 'tag_id',
    },
  },
};

export const noteToTagRelationConfig: ManyToManyRelationConfig = {
  sourceStore: storeConfig,
  relatedStore: tagsStoreConfig,
  relationStore: relationConfig,
  sourceForeignKey: 'note_id',
  relatedForeignKey: 'tag_id',
  relatedField: 'tags',
};
