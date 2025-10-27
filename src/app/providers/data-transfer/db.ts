import { inject } from 'vue';

import { notesStoreConfig, noteTagsRelationStoreConfig } from '@/entities/note';
import { tagsStoreConfig } from '@/entities/tag';
import DBClient, { type DBDataTransfer } from '@/shared/api/db/client';

export const createDBDataTransfer = (): DBDataTransfer => {
  return new DBClient({
    name: 'ai-notes',
    version: 2,
    stores: [notesStoreConfig, noteTagsRelationStoreConfig, tagsStoreConfig],
  });
};

export const dbDataTransferKey = Symbol('DbDataTransfer');
export const useDbDataTransfer = () => inject(dbDataTransferKey) as DBDataTransfer;
