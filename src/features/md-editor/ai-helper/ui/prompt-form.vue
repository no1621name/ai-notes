<script lang="ts" setup>
import { useRegleSchema } from '@regle/schemas';
import { type } from 'arktype';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { type SavedPrompt, SavedPromptsAccordion, useAiClient, ModelSelect } from '@/entities/ai-client';
import ErrorMessage from '@/shared/ui/error-message.vue';
import { SYMBOLS, useHotkey } from '@/shared/composables/use-hotkey';
import { useIsMobile } from '@/shared/composables/use-media-query';

defineProps<{
  isLoading: boolean;
  externalErrorMessage?: string;
}>();

const { t } = useI18n();

const isMobile = useIsMobile();
const selectedPrompt = ref<SavedPrompt | null>(null);
const { settings } = useAiClient();

const schema = type({
  model: 'string > 0',
  prompt: 'string > 0',
});

const { r$ } = useRegleSchema({
  model: settings.value?.model,
}, schema);

const handlePromptSelect = (prompt: SavedPrompt) => {
  selectedPrompt.value = prompt;
  r$.$value.prompt = prompt.prompt;
};

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: type.infer<typeof schema>): void;
  (e: 'clearError'): void;
}>();

const handleSubmit = async () => {
  const { data, valid } = await r$.$validate();
  if (!valid) return;

  emit('submit', data);
};

const handleInput = () => {
  selectedPrompt.value = null;
  emit('clearError');
};

watch(settings, () => {
  r$.$value.model = settings.value?.model || '';
});

useHotkey('mod+enter', handleSubmit);
useHotkey('esc', () => emit('close'));
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
    <ModelSelect
      class="select-xs w-full"
      v-model="r$.$value.model"
      @update:model-value="handleInput"
    />
    <ErrorMessage :state="r$.model"/>

    <textarea
      v-model="r$.$value.prompt"
      @input="handleInput"
      class="textarea resize-none textarea-xs w-full"
    />
    <ErrorMessage :state="r$.prompt"/>

    <SavedPromptsAccordion
      :selected-id="selectedPrompt?.id"
      @click="handlePromptSelect"
    />
    <ErrorMessage class="ml-auto" :message="externalErrorMessage"/>

    <footer class="flex gap-1 justify-end items-end mt-2">
      <button
        class="btn btn-primary btn-soft btn-xs"
        type="submit"
        :disabled="isLoading"
      >
        <template v-if="!isLoading">
          {{ t('actions.send') }}
          <span v-if="!isMobile" class="font-mono">
            <kbd class="kbd kbd-xs">{{ SYMBOLS.mod }}</kbd>+<kbd class="kbd kbd-xs">{{ SYMBOLS.enter }}</kbd>
          </span>
        </template>
        <span v-else class="loading loading-spinner loading-xs"/>
      </button>
      <button
        class="btn btn-soft btn-xs"
        type="button"
        @click="$emit('close')"
      >
        {{  t('actions.close') }}
      </button>
    </footer>
  </form>
</template>
