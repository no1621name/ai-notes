export { storeConfig as notesStoreConfig, relationConfig as noteTagsRelationStoreConfig } from './api/store-config';

export { useGetNote } from './queries/use-get-note';
export { useUpdateNote } from './queries/use-update-note';
export { useGetNotes } from './queries/use-get-notes';
export { useAddTagToNote } from './queries/tags/use-add-tag-to-note';
export { useRemoveTagFromNote } from './queries/tags/use-remove-tag-from-note';

export { useUpdateTitle } from './model/composables/use-update-title';
export { useUpdateText } from './model/composables/use-update-text';
export { useUpdateReminder } from './model/composables/use-update-reminder';

export { default as NoteCard } from './ui/card.vue';
export { default as NoteTitleField } from './ui/title.vue';
