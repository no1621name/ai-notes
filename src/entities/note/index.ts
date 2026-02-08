export { storeConfig as notesStoreConfig, relationConfig as noteTagsRelationStoreConfig } from './api/store-config';

export { useGetNote } from './queries/use-get-note';
export { useUpdateNote } from './queries/use-update-note';
export { useCreateNote } from './queries/use-create-note';
export { useGetNotes } from './queries/use-get-notes';
export { useAddTagToNote } from './queries/tags/use-add-tag-to-note';
export { useRemoveTagFromNote } from './queries/tags/use-remove-tag-from-note';

export { useUpdateTitle } from './model/composables/use-update-title';
export { useUpdateText } from './model/composables/use-update-text';
export { useUpdateReminder } from './model/composables/use-update-reminder';
export { messagesStoreConfig } from './model/messages-store';

export { setupReminders } from './lib/setup-reminders';

export { default as NoteCard } from './ui/card.vue';
export { default as CreateNoteLink } from './ui/create-note-link.vue';
export { default as CreateNoteButton } from './ui/create-note-button.vue';
export { default as NoteTitleField } from './ui/title.vue';
export { default as NoteSearchInput } from './ui/search-input.vue';
export { default as NoteBaseCard } from './ui/base-card.vue';
