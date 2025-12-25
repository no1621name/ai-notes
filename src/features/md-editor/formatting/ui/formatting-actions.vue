<script lang="ts" setup>
import { useEditor, EditorActionButton } from '@/entities/md-editor';
import { DEFAULT_ACTIONS } from '../model/config';

const { editor } = useEditor();
</script>

<template>
  <div
    v-if="editor"
    class="flex gap-2 flex-wrap items-center"
  >
    <EditorActionButton
      v-for="action in DEFAULT_ACTIONS"
      :key="action.id"
      :action="action"
      :editor="editor"
    />
  </div>
</template>
