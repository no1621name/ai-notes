import type { DataTransfer } from '@/shared/types/api';
import type { NoteBody } from './contracts';
import { storeConfig } from './store-config';

export const createNote = (dataTransfer: DataTransfer, note: Omit<NoteBody, 'id' | 'created_at'>) => {
  return dataTransfer.create(storeConfig.name, { ...note, created_at: new Date(Date.now()) });
};
