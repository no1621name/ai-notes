import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import { storeConfig } from './store-config';
import type { TagBody } from './contracts';

export const getTag = async (dataTransfer: DataTransfer, id: PrimaryKeyType) => {
  return dataTransfer.getById<TagBody>(storeConfig.name, id);
};
