<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { EditorBubbleMenu, useEditor, useGetEditorSelection } from '@/entities/md-editor';
import { AiServiceError, useAiClient } from '@/entities/ai-client';
import { useAiHelper } from '../composables/use-ai-helper';
import { SYMBOLS, useHotkey } from '@/shared/composables/use-hotkey';
import PromptForm from './prompt-form.vue';
import Response from './response.vue';
import { useIsMobile } from '@/shared/composables/use-media-query';

const { t } = useI18n();
const isMobile = useIsMobile();

const { editor } = useEditor();
const { getEditorSelection } = useGetEditorSelection();
const {
  isActive,
  shouldClose,
  closeAiHelper,
  applyAiResponse,
  setShouldCloseAiHelper,
} = useAiHelper();

const { settingsHasValidApiKey, client, settings } = useAiClient();

const response = ref<string>('');
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

const handlePrompt = async (payload: { model: string; prompt: string }) => {
  if (!settings.value || isLoading.value) return;

  isLoading.value = true;
  response.value = '';

  try {
    const completions = client.getCompletions(payload.prompt, {
      ...settings.value,
      model: payload.model,
    }, getEditorSelection());

    for await (const chunk of completions) {
      if (chunk.error) {
        response.value = chunk.errorMessage || 'Unknown error';
        break;
      }

      response.value += chunk.message || '';
    }
  } catch (error: unknown) {
    if (error instanceof AiServiceError) {
      errorMessage.value = error.message;
    }
  } finally {
    isLoading.value = false;
  }
};

const handleApply = () => {
  if (isLoading.value) return;

  applyAiResponse(response.value);
  response.value = '';
};

const handleDeny = () => {
  if (isLoading.value) return;

  response.value = '';
};

const handleClose = () => {
  if (shouldClose.value) {
    closeAiHelper();
    setShouldCloseAiHelper(false);
    return;
  }
};

useHotkey('mod+enter', handleApply);
useHotkey('mod+backspace', handleDeny);
</script>

<template>
  <EditorBubbleMenu
    v-if="editor"
    :floatingOptions="{
      placement: 'bottom-start',
      flip: false,
    }"
    plugin-key-name="ai"
    :shouldShow="isActive"
    container-class="w-64"
    v-click-outside="handleClose"
  >
    <div class="flex flex-col">
      <div v-if="!settingsHasValidApiKey" class="flex items-end gap-1 flex-col">
        <span class="badge badge-soft badge-warning py-1 h-max text-center">
          {{ t('apiKeyNeeded') }}
        </span>
        <button class="btn btn-soft btn-xs" @click="closeAiHelper">
          {{  t('actions.close') }}
        </button>
      </div>
      <div v-else>
        <template v-if="response">
          <Response>
            {{ response }}
          </Response>
          <footer class="flex justify-end mt-2 flex-wrap gap-0.5">
            <button
              class="btn btn-xs"
              @click="handleApply"
            >
              {{ t('actions.apply') }}
              <span v-if="!isMobile" class="font-mono" >
                <kbd class="kbd kbd-xs">{{ SYMBOLS.mod }}</kbd>+<kbd class="kbd kbd-xs">{{ SYMBOLS.enter }}</kbd>
              </span>
            </button>
            <button
              class="btn btn-xs"
              @click="handleDeny"
            >
              {{ t('actions.deny') }}
              <span v-if="!isMobile" class="font-mono">
                <kbd class="kbd kbd-xs">{{ SYMBOLS.mod }}</kbd>+<kbd class="kbd kbd-xs">{{ SYMBOLS.backspace }}</kbd>
              </span>
            </button>
          </footer>
        </template>
        <template v-else>
          <PromptForm
            :is-loading="isLoading"
            :external-error-message="errorMessage"
            @submit="handlePrompt"
            @close="closeAiHelper"
            @clear-error="errorMessage = ''"
          />
        </template>
      </div>
    </div>
  </EditorBubbleMenu>
</template>

<i18n>
{
  "en": {
    "apiKeyNeeded": "Visit settings and pass valid API key"
  },
  "ru": {
    "apiKeyNeeded": "Посетите настройки и введите корректный API ключ"
  }
}
</i18n>
