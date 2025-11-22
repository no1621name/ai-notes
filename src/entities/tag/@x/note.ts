import type { TagBody } from '../api/contracts';

export type WithTags<T> = T & { tags: TagBody[] };

export type { Tag } from '../model/types';
export { storeConfig as tagsStoreConfig } from '../api/store-config';
export { getTag } from '../api/get-tag';

export type { TagBody };
