import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { TagBody } from './contracts';
import { storeConfig } from './store-config';

export const updateTag = (dataTransfer: DataTransfer, id: PrimaryKeyType, body: Partial<TagBody>) => {
  return dataTransfer.update<Partial<TagBody>>(storeConfig.name, { ...body, id });
};
