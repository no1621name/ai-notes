import type { PrimaryKeyType, DataTransfer } from '@/shared/types/api';
import type { NoteData } from '../model/types';
import { storeConfig } from './store-config';

export const getNote = async (dataTransfer: DataTransfer, id: PrimaryKeyType) => {
  return dataTransfer.getById<NoteData>(storeConfig.name, id);
};
