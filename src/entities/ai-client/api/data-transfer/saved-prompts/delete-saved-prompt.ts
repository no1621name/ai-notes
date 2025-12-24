import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import { storeConfig } from './store-config';

export const deleteSavedPrompt = (dataTransfer: DataTransfer, id: PrimaryKeyType) => {
  return dataTransfer.delete(storeConfig.name, id);
};
