import type { DBDataTransfer } from '@/shared/api/db/client';
import PaginationService from '@/shared/api/db/services/pagination';
import { storeConfig } from './store-config';
import type { SavedPrompt } from './contracts';

export const getSavedPrompts = (dataTransfer: DBDataTransfer) => {
  const paginator = new PaginationService(storeConfig, dataTransfer);
  return paginator.getPage<SavedPrompt>(storeConfig.name, {
    page: 1,
    pageSize: -1,
  });
};
