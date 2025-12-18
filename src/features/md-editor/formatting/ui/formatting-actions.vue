<script lang="ts" setup>
import { useEditor, EditorActionButton } from '@/entities/md-editor';
import { DEFAULT_ACTIONS } from '../model/config';

const { getEditor } = useEditor();

const editor = getEditor();
</script>

<template>
  <div
    v-if="editor?.editor"
    class="flex gap-2 flex-wrap items-center"
  >
    <EditorActionButton
      v-for="action in DEFAULT_ACTIONS"
      :key="action.id"
      :action="action"
      :editor="editor.editor"
    />
  </div>
</template>
