<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { EditorBubbleMenu } from '@/entities/md-editor';
import { AIHelperToggler, useAiHelper } from '@/features/md-editor/ai-helper';
import { FormattingDropdown, DEFAULT_FORMATTING_ACTIONS } from '@/features/md-editor/formatting';
import { QuickActions, QuickActionToggler, useGetQuickActions } from '@/features/md-editor/quick-actions';
import { useEditor } from '@/entities/md-editor';

const { t } = useI18n();

const { editor } = useEditor();
const { isActive: isAiHelperActive } = useAiHelper();

const { data: quickActions } = useGetQuickActions(DEFAULT_FORMATTING_ACTIONS);
</script>

<template>
  <EditorBubbleMenu
    v-if="editor"
    plugin-key-name="main"
    :should-show="!isAiHelperActive"
    :floating-options="{
      placement: 'bottom-start',
    }"
  >
    <FormattingDropdown>
      <template #trigger="{toggle}">
        <div class="flex items-center gap-2">
          <button @click="toggle" class="btn btn-sm btn-ghost">
            {{ t('styles') }}
          </button>
          <QuickActions v-if="!!quickActions?.length" :quick-actions="quickActions"/>
          <AIHelperToggler/>
        </div>
      </template>
      <template #option="{ id }">
        <QuickActionToggler
          :action-id="id"
          :is-selected="!!quickActions?.some(quickAction => quickAction?.id === id)"
        />
      </template>
    </FormattingDropdown>
  </EditorBubbleMenu>
</template>

<i18n>
{
  "en": {
    "styles": "Styles"
  },
  "ru": {
    "styles": "Стили"
  }
}
</i18n>
