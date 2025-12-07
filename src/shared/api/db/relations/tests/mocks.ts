import { vi } from 'vitest';

import { SchemaFieldType, type DataStore } from '@/shared/types/api';
import { ManyToManyManager, type ManyToManyRelationConfig } from '../many-to-many';
import DBClient, { type DBErrorNotifier } from '../../client.ts';

export interface Source {
  id: string;
  name: string;
}

export interface Related {
  id: string;
  name: string;
}

export interface Relation {
  source_id: string;
  related_id: string;
  id: string;
}

export const sourceConfig: DataStore = {
  name: 'source',
  primaryKey: 'id',
  schema: {
    name: SchemaFieldType.NOT_UNIQUE,
  },
  indexes: {
    name: {
      name: 'name',
      keyPath: 'name',
    },
  },
};

export const relatedConfig: DataStore = {
  name: 'related',
  primaryKey: 'id',
  schema: {
    name: SchemaFieldType.NOT_UNIQUE,
  },
  indexes: {
    name: {
      name: 'name',
      keyPath: 'name',
    },
  },
};

export const relationConfig: DataStore = {
  name: 'source_related',
  primaryKey: 'id',
  schema: {
    source_id: SchemaFieldType.NOT_UNIQUE,
    related_id: SchemaFieldType.NOT_UNIQUE,
  },
  indexes: {
    source_id: {
      name: 'source_id_index',
      keyPath: 'source_id',
    },
    related_id: {
      name: 'related_id_index',
      keyPath: 'related_id',
    },
  },
};

const sourceToRelatedRelationConfig: ManyToManyRelationConfig = {
  sourceStore: sourceConfig,
  relatedStore: relatedConfig,
  relationStore: relationConfig,
  sourceForeignKey: 'source_id',
  relatedForeignKey: 'related_id',
  relatedField: 'related',
};

const dbConfig = {
  name: 'testDB',
  version: 1,
  stores: [sourceConfig, relatedConfig, relationConfig],
};

const mockErrorNotifier: DBErrorNotifier = {
  add: vi.fn(),
  invalidStoreName: vi.fn(),
  missingPrimaryKey: vi.fn(),
  requestFailed: vi.fn(),
};

export const dbClient = new DBClient(dbConfig, mockErrorNotifier);
export const manager = new ManyToManyManager(sourceToRelatedRelationConfig, dbClient);
