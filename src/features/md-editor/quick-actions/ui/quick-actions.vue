<script setup lang="ts">
import { EditorActionButton, useEditor, type EditorAction } from '@/entities/md-editor';

defineProps<{
  quickActions: EditorAction[];
}>();

const { getEditor } = useEditor();
const editorRef = getEditor();
</script>

<template>
  <div class="flex gap-x-1" v-if="!!editorRef">
    <EditorActionButton
      v-for="action in quickActions"
      :key="action?.id"
      :editor="editorRef.editor"
      :action="action"
    />
  </div>
</template>
