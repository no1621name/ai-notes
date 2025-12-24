import type { DBDataTransfer } from '@/shared/api/db/client';
import type { TagBody } from './contracts';
import { storeConfig } from './store-config';
import PaginationService from '@/shared/api/db/services/pagination';

export const getTags = (dataTransfer: DBDataTransfer) => {
  const paginator = new PaginationService(storeConfig, dataTransfer);
  return paginator.getPage<TagBody>(storeConfig.name, {
    page: 1,
    pageSize: -1,
  });
};
