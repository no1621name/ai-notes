<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import type { Editor as TipTapEditor } from '@tiptap/vue-3';
import Note from '@/entities/note/ui.vue';
import Editor from '@/shared/ui/md-editor/editor.vue';
import EditorActions from '@/shared/ui/md-editor/editor-actions.vue';
import Button from '@/shared/ui/button.vue';

const editorRef = useTemplateRef<{ editor: TipTapEditor }>('editor');
</script>

<template>
  <RouterLink class="link" to="/drawer">asfdasdf</RouterLink>
  <Note id="1" />
  <EditorActions :editor="editorRef?.editor" key="1" />
  <Editor ref="editor" key="1" />
  <Button @click="() => console.log(editorRef?.editor.getJSON())">a</Button>
</template>
