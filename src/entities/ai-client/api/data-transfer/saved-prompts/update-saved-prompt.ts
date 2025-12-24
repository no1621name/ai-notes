import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import { storeConfig } from './store-config';
import type { SavedPromptBody, SavedPrompt } from './contracts';

export const updateSavedPrompt = (dataTransfer: DataTransfer, id: PrimaryKeyType, body: SavedPromptBody) => {
  return dataTransfer.update<SavedPrompt>(storeConfig.name, { ...body, id });
};
