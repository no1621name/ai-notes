import type { DataTransfer } from '@/shared/types/api';
import type { NoteBody } from './contracts';
import { storeConfig } from './store-config';

export const createNote = (dataTransfer: DataTransfer, note: Omit<NoteBody, 'id' | 'created_at' | 'updated_at'>) => {
  const now = new Date(Date.now());
  return dataTransfer.create(storeConfig.name, {
    ...note,
    created_at: now,
    updated_at: now,
  });
};
