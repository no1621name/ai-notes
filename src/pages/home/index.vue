<script lang="ts" setup>
import { provide, shallowRef } from 'vue';

import type { Editor as TipTapEditor } from '@tiptap/vue-3';

import { editorInjectionKey } from '@/entities/md-editor';

import { TagBadge } from '@/entities/tag';
import { NoteCard, useGetNotes } from '@/entities/note';

const editor = shallowRef<{ editor: TipTapEditor } | null>(null);

provide(editorInjectionKey, editor);

const { data } = useGetNotes();
</script>

<template>
  <div>
    <RouterLink class="link" to="/note/1">asfdasdf</RouterLink>
    <div class="grid grid-cols-3 gap-3 m-3">
      <NoteCard
        v-for="note in data"
        :key="note.id"
        :note="note"
      >
        <template #tags="{ tags }">
          <TagBadge
            v-for="tag in tags"
            :key="tag.id"
            :tag="tag"
          />
        </template>
      </NoteCard>
    </div>
    <!-- <div>
      <MainBubbleMenu/>
      <Editor ref="editor" key="1" />
    </div> -->
  </div>

  <!-- <div>
    <ThemeController/>
    <TagsList/>
  </div> -->
</template>
