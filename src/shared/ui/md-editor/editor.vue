<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/vue-3/menus';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { BubbleMenu as BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import { all, createLowlight } from 'lowlight';

import CodeBlock from './code-block.vue';

const lowlight = createLowlight(all);

const editor = new Editor({
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    TaskItem.configure({
      nested: true,
    }),
    TaskList,
    BubbleMenuPlugin.configure({
      pluginKey: 'one',
    }),
    BubbleMenuPlugin.configure({
      pluginKey: 'two',
    }),
    Placeholder.configure({
      placeholder: 'Write something',
    }),
    CodeBlockLowlight.extend({
      addNodeView() {
        return VueNodeViewRenderer(CodeBlock);
      },
    }).configure({ lowlight }),
    Typography,
  ],
});

defineExpose({ editor });

onBeforeUnmount(() => {
  editor.destroy();
});
</script>

<template>
  <div class="w-1/2">
    <EditorContent
      :editor="editor"
      class="editor-prose prose prose-p:my-2 prose-blockquote:alert prose-h2:mt-6 prose-h3:mt-4"
    />
    <BubbleMenu plugin-key="one" :editor="editor" :options="{ autoPlacement: true }">1</BubbleMenu>
    <!--
    сделать основные действия над текстом в всплывающем меню, списком - более сложные действия, кнопками - простые
    и как раз там будет кнопка, триггерящая появление
    -->
    <!-- <BubbleMenu plugin-key="two" :editor="editor" :options="{ placement: 'left' }">2</BubbleMenu> -->
  </div>
</template>

<style>
.tiptap {
  border: 2px solid var(--color-base-300);
}

.tiptap:focus {
  border-color: var(--color-neutral);
  outline: none;
}

.prose.editor-prose {
  line-height: 1;
}

.tiptap p.is-editor-empty:first-child::before {
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
  color: var(--color-neutral-content);
  content: attr(data-placeholder);
}

.tiptap ul[data-type='taskList'] {
  list-style: none;
  margin-left: 0;
  padding: 0;
}

.tiptap ul[data-type='taskList'] li {
  display: flex;
  align-items: flex-start;
}

.tiptap ul[data-type='taskList'] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap ul[data-type='taskList'] li > div {
  flex: 1 1 auto;
}
.tiptap ul[data-type='taskList'] li > div p {
  margin: 0;
}
</style>
