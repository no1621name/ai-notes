<script lang="ts" setup>
import { provide, shallowRef } from 'vue';
import type { Editor as TipTapEditor } from '@tiptap/vue-3';

import NotesList from '@/features/note/notes-list.vue';
import { editorInjectionKey } from '@/entities/md-editor';

const editor = shallowRef<{ editor: TipTapEditor } | null>(null);

provide(editorInjectionKey, editor);
</script>

<template>
  <div>
    <NotesList/>
  </div>
</template>
