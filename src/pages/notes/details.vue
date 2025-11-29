<script lang="ts" setup>
import { computed, watch, ref, provide, shallowRef, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { EditorEvents, Editor as TipTapEditor } from '@tiptap/vue-3';

import ManageNoteTags from '@/features/note/manage-note-tags.vue';
import { MainBubbleMenu, Editor, editorInjectionKey, resetEditorContent } from '@/entities/md-editor';
import {
  useGetNote,
  NoteTitleField,
  useUpdateTitle,
  useUpdateText,
  useUpdateReminder } from '@/entities/note';
import DrawerLayout from '@/shared/ui/drawer/content-layout.vue';
import { useToasterStore } from '@/app/stores/toaster';
import FormattingActions from '@/entities/md-editor/ui/formatting/formatting-actions.vue';
import { formatForDatetimeLocal } from '@/shared/lib/date';

const route = useRoute();
const { add: addToast } = useToasterStore();

const noteId = computed<string>(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id[0];
  }

  return route.params.id;
});

const { data, isFetching: isLoading } = useGetNote(noteId);

const editor = shallowRef<{ editor: TipTapEditor } | null>(null);
const noteTitle = ref<string | null>(null);
const lastAppliedMutationId = ref<number | null>(null);
const selectedReminderDate = ref('');
const minReminderDate = formatForDatetimeLocal(Date.now());

const { updateTitle } = useUpdateTitle(noteId);
const { updateReminder } = useUpdateReminder(noteId);
const { updateText } = useUpdateText(noteId, () => {
  lastAppliedMutationId.value = (lastAppliedMutationId.value ?? 0) + 1;
});

const editorUpdateCallback = ({ editor: instance }: EditorEvents['update']) => {
  updateText(instance.getJSON());
};

const setEditorContent = (text: string) => {
  if (!editor.value?.editor) return;

  try {
    const content = JSON.parse(text);
    resetEditorContent(editor.value.editor, content);
  } catch {
    addToast({
      title: 'Error',
      message: 'Failed to load note content',
      type: 'danger',
    });
  }
};

provide(editorInjectionKey, editor);

watch(noteId, () => {
  lastAppliedMutationId.value = null;
});

watch(data, (newData) => {
  if (!newData) return;

  if (newData.__mutationId === lastAppliedMutationId.value) {
    return;
  }

  noteTitle.value = newData.title;
  if (newData.reminder_date) {
    selectedReminderDate.value = formatForDatetimeLocal(newData.reminder_date);
  }
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

watch(selectedReminderDate, (value) => {
  if (formatForDatetimeLocal(data.value?.reminder_date) === value) {
    return;
  }

  updateReminder(value);
});

onUnmounted(() => {
  editor.value?.editor.off('update', editorUpdateCallback);
});
</script>

<template>
  <DrawerLayout>
    <template #header>
      <NoteTitleField
        :model-value="noteTitle"
        @update:model-value="updateTitle"
        :skeleton="isLoading && (!noteTitle || data?.id !== noteId)"
      />
      <ManageNoteTags
        :note-id="noteId"
        :tags="data?.tags"
        :is-loading="isLoading"
      />

      <fieldset class="fieldset">
        <p class="label">Reminder date</p>
        <input
          type="datetime-local"
          id="event-datetime"
          v-model="selectedReminderDate"
          class="input input-xs w-max"
          :min="minReminderDate"
        >
      </fieldset>
    </template>
    <template #toolbar>
      <div class="flex items-end gap-2 flex-wrap">
        <FormattingActions/>
        <span v-if="!!editor?.editor" class="flex flex-col text-xs">
          <span>chars: {{editor?.editor.storage.characterCount.characters()}}</span>
          <span>words: {{editor?.editor.storage.characterCount.words()}}</span>
        </span>
      </div>
    </template>
    <template #default>
      <div class="flex-1 flex flex-col min-h-0">
        <MainBubbleMenu/>
        <Editor
          ref="editor"
          :skeleton="isLoading && !data?.text"
          class="flex-1"
        />
      </div>
    </template>
  </DrawerLayout>
</template>
