import type { DBDataTransfer } from '@/shared/api/db/client';
import type { TagBody } from './contracts';
import { storeConfig } from './store-config';

export const getTags = async (dataTransfer: DBDataTransfer) => {
  return dataTransfer.getAll<TagBody>(storeConfig.name);
};
