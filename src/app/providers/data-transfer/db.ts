import { inject } from 'vue';

import { messagesStoreConfig, notesStoreConfig, noteTagsRelationStoreConfig } from '@/entities/note';
import { tagsStoreConfig } from '@/entities/tag';
import { savedPromptsStoreConfig } from '@/entities/ai-client';
import DBClient, { type DBDataTransfer, type DBErrorNotifier } from '@/shared/api/db/client';

export const createDBDataTransfer = (errorNotifier: DBErrorNotifier): DBDataTransfer => {
  return new DBClient({
    name: 'ai-notes',
    version: 2,
    stores: [notesStoreConfig, noteTagsRelationStoreConfig, tagsStoreConfig, savedPromptsStoreConfig],
  }, errorNotifier);
};

export const createMessagesDataTransfer = (errorNotifier: DBErrorNotifier): DBDataTransfer => {
  return new DBClient({
    name: 'messages',
    version: 1,
    stores: [messagesStoreConfig],
  }, errorNotifier);
};

export const dbDataTransferKey = Symbol('DbDataTransfer');
export const useDbDataTransfer = () => inject(dbDataTransferKey) as DBDataTransfer;

export const messagesDataTransferKey = Symbol('MessagesDataTransfer');
export const useMessagesDataTransfer = () => inject(messagesDataTransferKey) as DBDataTransfer;
