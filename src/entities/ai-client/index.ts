export { default as SettingsModal } from './ui/settings-modal.vue';
export { default as SavedPromptsList } from './ui/saved-prompts/list.vue';
export { default as SavedPromptsAccordion } from './ui/saved-prompts/accordion.vue';

export { useAiClient } from './composables/use-ai-client';
export { storeConfig as savedPromptsStoreConfig } from './api/data-transfer/saved-prompts/store-config';

export type { SavedPrompt } from './model/types';
export { AiServiceError } from './model/errors';
