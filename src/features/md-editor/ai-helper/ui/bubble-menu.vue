<script lang="ts" setup>
import { EditorBubbleMenu, useEditor, useGetEditorSelection } from '@/entities/md-editor';
import { AiServiceError, useAiClient } from '@/entities/ai-client';
import { useAiHelper } from '../composables/use-ai-helper';
import PromptForm from './prompt-form.vue';
import Response from './response.vue';
import { ref } from 'vue';

const { editor } = useEditor();
const { getEditorSelection } = useGetEditorSelection();
const {
  isActive,
  shouldClose,
  toggleAiHelper,
  closeAiHelper,
  applyAiResponse,
  setShouldCloseAiHelper,
} = useAiHelper();

const { settingsHasValidApiKey, client, settings } = useAiClient();

const response = ref<string>('');
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

const handlePrompt = async (payload: { model: string; prompt: string }) => {
  if (!settings.value) return;

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
  applyAiResponse(response.value);
  response.value = '';
};

const handleClose = () => {
  if (shouldClose.value) {
    closeAiHelper();
    setShouldCloseAiHelper(false);
    return;
  }
};
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
      <span v-if="!settingsHasValidApiKey" class="badge badge-soft badge-warning">
        Visit settings and pass valid API key
      </span>
      <div v-else>
        <template v-if="response">
          <Response>
            {{ response }}
          </Response>
          <footer class="flex justify-end mt-2">
            <button class="btn btn-xs" @click="handleApply">Apply</button>
            <button class="btn btn-xs" @click="response = ''">Deny</button>
          </footer>
        </template>
        <template v-else>
          <PromptForm
            :is-loading="isLoading"
            :external-error-message="errorMessage"
            @submit="handlePrompt"
            @close="toggleAiHelper"
            @clear-error="errorMessage = ''"
          />
        </template>
      </div>
    </div>
  </EditorBubbleMenu>
</template>
        <!-- кнопка отправки промпта -->
        <!-- смена на окно вывода ответа (чанками) -->
        <!-- кнопка принять/отклонить -->
        <!-- СМ extensions/commands наверное придется делать отдельный плагин, тк нужно сохранять положение курсора для вставки контента -->
        <!-- пересмотреть раскидку компонентов по слоям -->
