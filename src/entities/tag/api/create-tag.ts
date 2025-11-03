import type { DataTransfer } from '@/shared/types/api';
import type { TagBody } from './contracts';
import { storeConfig } from './store-config';

export const createTag = (dataTransfer: DataTransfer, body: Omit<TagBody, 'id' | 'created_at'>) => {
  return dataTransfer.create(storeConfig.name, { ...body, created_at: new Date(Date.now()) });
};
