import type { DataTransfer } from '@/shared/types/api';
import type { Note } from '../model/interface';
import { storeConfig } from './store-config';

export const createNote = (dataTransfer: DataTransfer, note: Note) => {
  return dataTransfer.create<Note>(storeConfig.name, note);
};
