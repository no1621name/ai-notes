export type { Tag } from './model/types';

export { storeConfig as tagsStoreConfig } from './api/store-config';

export { useGetTags } from './queries/use-get-tags';

export { default as TagBadge } from './ui/tag-badge.vue';
export { default as TagsDropdown } from './ui/tags-dropdown.vue';
export { default as TagsList } from './ui/tags-list.vue';
