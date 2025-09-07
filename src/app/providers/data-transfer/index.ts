import type { DataTransfer } from '@/shared/types/api';
import DBClient from '@/shared/api/db/client';

import { notesStoreConfig } from '@/entities/note';
import { inject } from 'vue';

export const createDataTransfer = (): DataTransfer => {
  return new DBClient({
    name: 'ai-notes',
    version: 1,
    stores: [notesStoreConfig],
  });
};

export const dataTransferKey = Symbol('DataTransfer');
export const useDataTransfer = () => inject(dataTransferKey) as DataTransfer;
