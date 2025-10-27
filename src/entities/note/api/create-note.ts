import type { DataTransfer } from '@/shared/types/api';
import type { NoteData } from '../model/types';
import { storeConfig } from './store-config';

export const createNote = (dataTransfer: DataTransfer, note: NoteData) => {
  return dataTransfer.create<NoteData>(storeConfig.name, note);
};
