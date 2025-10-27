<script setup lang="ts">
import { inject } from 'vue';
import { editorInjectionKey } from '../../model/keys';
import { useGetQuickActions } from '../../queries/use-get-quick-actions';
import ActionButton from '../base/action-button.vue';

const editorRef = inject(editorInjectionKey);
const { data: quickActions } = useGetQuickActions();
</script>

<template>
  <div class="flex gap-x-1" v-if="!!editorRef && !!quickActions">
    <ActionButton
      v-for="action in quickActions"
      :key="action?.id"
      :editor="editorRef.editor"
      :action="action"
    />
  </div>
</template>
