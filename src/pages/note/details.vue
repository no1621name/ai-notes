<script lang="ts" setup>
import { computed, watch, ref, shallowRef, onUnmounted, onMounted, onDeactivated } from 'vue';
import { useRoute } from 'vue-router';

import type { EditorEvents } from '@tiptap/vue-3';

import { addToast } from '@/app/providers/toasts';
import MainBubbleMenu from '@/widgets/md-editor/main-bubble-menu.vue';
import ManageNoteTags from '@/features/note/manage-note-tags.vue';
import SetReminder from '@/features/note/set-reminder.vue';
import { AIHelperMenu } from '@/features/md-editor/ai-helper';
import { FormattingActions } from '@/features/md-editor/formatting';
import { type EditorRef, Editor, EditorStats, resetEditorContent, useEditor } from '@/entities/md-editor';
import {
  useGetNote,
  NoteTitleField,
  useUpdateTitle,
  useUpdateText,
} from '@/entities/note';
import DrawerLayout from '@/shared/ui/drawer/content-layout.vue';
import { SearchPopup, SearchToggler } from '@/features/md-editor/search';

const route = useRoute();

const noteId = computed<string>(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id[0] ?? '';
  }

  return route.params.id ?? '';
});

const { data, isFetching: isLoading } = useGetNote(noteId);

const { setEditor } = useEditor();

const editor: EditorRef = shallowRef(null);
const noteTitle = ref<string | null>(null);
const lastAppliedMutationId = ref<number | null>(null);

const { updateTitle } = useUpdateTitle(noteId);
const { updateText } = useUpdateText(noteId, () => {
  lastAppliedMutationId.value = (lastAppliedMutationId.value ?? 0) + 1;
});

const editorUpdateCallback = ({ editor: instance }: EditorEvents['update']) => {
  updateText(instance.getJSON());
};

const setEditorContent = (text: string) => {
  if (!editor.value?.editor || !text) return;

  try {
    const content = JSON.parse(text);
    resetEditorContent(editor.value.editor, content);
  } catch {
    addToast({
      title: 'toasts.error.title',
      message: 'toasts.error.note.loadFailed',
      type: 'danger',
    });
  }
};

setEditor(editor);

watch(noteId, () => {
  lastAppliedMutationId.value = null;
});

watch(data, (newData) => {
  if (!newData) return;

  if (newData.__mutationId === lastAppliedMutationId.value) {
    return;
  }

  noteTitle.value = newData.title;

  setEditorContent(newData.text);
});

onMounted(() => {
  if (data.value) {
    noteTitle.value = data.value.title;

    if (data.value.text) {
      setEditorContent(data.value.text);
    }
  }
});

watch(() => editor.value?.editor, (instance) => {
  if (instance) {
    instance.on('update', editorUpdateCallback);

    if (!!data.value?.text && !instance.getText()) {
      setEditorContent(data.value.text);
    }
  }
});

const cleanupEditor = () => {
  editor.value?.editor.off('update', editorUpdateCallback);
};

onDeactivated(cleanupEditor);
onUnmounted(cleanupEditor);
</script>

<template>
  <DrawerLayout>
    <template #header>
      <NoteTitleField
        :model-value="noteTitle"
        @update:model-value="(value) => updateTitle(value, noteTitle)"
        :skeleton="isLoading && (!noteTitle || data?.id !== noteId)"
      />
      <ManageNoteTags
        :note-id="noteId"
        :tags="data?.tags"
        :is-loading="isLoading"
      />

      <SetReminder
        :note-id="noteId"
        :date="data?.reminder_date"
        :note-title="data?.title"
      />
    </template>
    <template #toolbar>
      <div class="w-full overflow-auto">
        <div class="flex items-start sm:items-end gap-2 w-full flex-wrap">
          <FormattingActions />
          <EditorStats/>
          <SearchToggler/>
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex-1 flex flex-col min-h-0">
        <MainBubbleMenu/>
        <AIHelperMenu/>
        <Editor
          ref="editor"
          :skeleton="isLoading && !data?.text"
          class="flex-1"
        >
          <SearchPopup class="sticky z-1 top-0 ml-auto"/>
        </Editor>
      </div>
    </template>
  </DrawerLayout>
</template>
