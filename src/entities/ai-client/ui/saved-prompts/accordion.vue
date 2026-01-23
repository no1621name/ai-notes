<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { SavedPrompt } from '../../model/types';
import { useGetSavedPrompts } from '../../queries/saved-prompts/use-get-saved-prompts';
import SavedPromptBadge from './badge.vue';

defineProps<{
  selectedId?: SavedPrompt['id'];
}>();

defineEmits<{
  (e: 'click', payload: SavedPrompt): void;
}>();

const { t } = useI18n();

const { data: savedPrompts } = useGetSavedPrompts();
</script>

<template>
  <details class="collapse collapse-arrow bg-base-100 border border-base-300" name="saved-prompts-accordion">
    <summary class="collapse-title text-xs font-semibold p-2 select-none after:right-3">
      {{ t('savedPrompts') }}
    </summary>
    <div class="collapse-content p-2">
      <div class="overflow-y-auto max-h-24">
        <div class="flex-wrap flex items-center gap-1 h-max">
          <SavedPromptBadge
            v-for="prompt in savedPrompts"
            :key="prompt.id"
            :prompt="prompt"
            :selected="prompt.id === selectedId"
            class="cursor-pointer hover:badge-outline text-xs"
            @click="$emit('click', prompt)"
          />
        </div>
      </div>
    </div>
  </details>
</template>
