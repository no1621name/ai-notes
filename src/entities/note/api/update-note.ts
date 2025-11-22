import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { NoteBody } from './contracts';
import { storeConfig } from './store-config';

export const updateNote = (dataTransfer: DataTransfer, id: PrimaryKeyType, body: Partial<NoteBody>) => {
  const { created_at, updated_at, ...rest } = body;

  return dataTransfer.update<Partial<NoteBody>>(storeConfig.name, {
    ...rest,
    id,
    updated_at: new Date(Date.now()),
  });
};
