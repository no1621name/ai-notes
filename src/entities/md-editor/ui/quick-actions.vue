<script setup lang="ts">
import type { EditorInstanceType } from '../model/types';
import { useGetQuickActions } from '../queries/use-get-quick-actions';
import ActionButton from './action-button.vue';

defineProps<{
  editor?: EditorInstanceType;
}>();

const { data: quickActions } = useGetQuickActions();
</script>

<template>
  <div class="flex gap-x-1" v-if="!!editor && !!quickActions">
    <ActionButton
      v-for="action in quickActions"
      :key="action?.id"
      :editor="editor"
      :action="action"
    />
  </div>
</template>
