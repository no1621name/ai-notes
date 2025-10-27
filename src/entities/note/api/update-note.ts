import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { NoteData } from '../model/types';
import { storeConfig } from './store-config';

export const updateNote = (dataTransfer: DataTransfer, id: PrimaryKeyType, body: Partial<NoteData>) => {
  return dataTransfer.update<Partial<NoteData>>(storeConfig.name, { ...body, id });
};
