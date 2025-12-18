<script lang="ts" setup>
import { EditorBubbleMenu } from '@/entities/md-editor';
import { FormattingDropdown, DEFAULT_FORMATTING_ACTIONS } from '@/features/md-editor/formatting';
import { QuickActions, QuickActionToggler, useGetQuickActions } from '@/features/md-editor/quick-actions';

const { data: quickActions } = useGetQuickActions(DEFAULT_FORMATTING_ACTIONS);
</script>

<template>
  <EditorBubbleMenu>
    <div class="flex items-center gap-2">
      <FormattingDropdown>
        <template #option="{ id }">
          <span>{{id}}</span>
          <QuickActionToggler
            :action-id="id"
            :is-selected="!!quickActions?.some(quickAction => quickAction?.id === id)"
          />
        </template>
      </FormattingDropdown>

      <QuickActions v-if="!!quickActions?.length" :quick-actions="quickActions"/>
    </div>
  </EditorBubbleMenu>
</template>
