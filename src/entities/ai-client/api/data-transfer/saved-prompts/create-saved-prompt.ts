import type { DataTransfer } from '@/shared/types/api';
import { storeConfig } from './store-config';
import type { SavedPromptBody } from './contracts';

export const createSavedPrompt = (dataTransfer: DataTransfer, body: SavedPromptBody) => {
  return dataTransfer.create(storeConfig.name, { ...body, created_at: new Date(Date.now()) });
};
