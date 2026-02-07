<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useEditor, EditorActionButton } from '@/entities/md-editor';
import { DEFAULT_ACTIONS } from '../model/config';
import { useIsMobile } from '@/shared/composables/use-media-query';

const { t } = useI18n();

const isMobile = useIsMobile();
const { editor } = useEditor();
</script>

<template>
  <div v-if="editor" class="contents">
    <div v-if="isMobile" class="collapse collapse-arrow bg-base-200 min-w-[200px] max-w-2/3">
      <input type="checkbox" >
      <div class="collapse-title flex items-center gap-1 min-h-0 py-1 px-2">
        <span class="text-sm font-medium">{{ t('formatting') }}</span>
      </div>
      <div class="collapse-content pb-0 px-0">
        <div class="flex gap-1 flex-wrap justify-start">
          <EditorActionButton
            v-for="action in DEFAULT_ACTIONS"
            :key="action.id"
            :action="action"
            :editor="editor"
          />
        </div>
      </div>
    </div>
    <div v-else class="flex gap-2 flex-wrap items-center">
      <EditorActionButton
        v-for="action in DEFAULT_ACTIONS"
        :key="action.id"
        :action="action"
        :editor="editor"
      />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "formatting": "Formatting"
  },
  "ru": {
    "formatting": "Форматирование"
  }
}
</i18n>
