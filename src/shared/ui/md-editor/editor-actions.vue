<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3';
import Button from '../button.vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

interface Action {
  icon: string;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}

defineProps<{ editor?: Editor }>();

const buttons: Action[] = [
  {
    icon: 'lu:heading-1',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    icon: 'lu:heading-2',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    icon: 'lu:heading-3',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    icon: 'lu:bold',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
  },
  {
    icon: 'lu:italic',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
  },
  {
    icon: 'lu:strikethrough',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
  },
  {
    icon: 'lu:list',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    icon: 'lu:list-ordered',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    icon: 'lu:list-checks',
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskList'),
  },
  {
    icon: 'lu:quote',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    icon: 'lu:undo-2',
    action: (editor) => editor.chain().focus().undo().run(),
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().undo().run(),
  },
  {
    icon: 'lu:redo-2',
    action: (editor) => editor.chain().focus().redo().run(),
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().redo().run(),
  },
];
</script>

<template>
  <div v-if="editor">
    <Button
      v-for="(button, index) in buttons"
      :key="index"
      class="btn-sm"
      @click="button.action(editor)"
      :class="{ 'btn-primary': button.isActive(editor) }"
      :disabled="button.isDisabled?.(editor) ?? false"
    >
      <VueIcon :name="button.icon" />
    </Button>
  </div>
</template>
