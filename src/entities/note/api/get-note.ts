import type { PrimaryKeyType, DataTransfer } from '@/shared/types/api';
import type { Note } from '../model/interface';
import { storeConfig } from './store-config';

export const getNote = (dataTransfer: DataTransfer, id: PrimaryKeyType) => {
  return dataTransfer.getById<Note>(storeConfig.name, id);
};
