<script setup lang="ts">
import { EditorActionButton, useEditor, type EditorAction } from '@/entities/md-editor';

defineProps<{
  quickActions: EditorAction[];
}>();

const { editor } = useEditor();
</script>

<template>
  <div class="flex gap-x-1" v-if="editor">
    <EditorActionButton
      v-for="action in quickActions"
      :key="action?.id"
      :editor="editor"
      :action="action"
    />
  </div>
</template>
