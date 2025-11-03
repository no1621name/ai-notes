import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { NoteBody } from './contracts';
import { storeConfig } from './store-config';

export const updateNote = (dataTransfer: DataTransfer, id: PrimaryKeyType, body: Partial<NoteBody>) => {
  return dataTransfer.update<Partial<NoteBody>>(storeConfig.name, { ...body, id });
};
