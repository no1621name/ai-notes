<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import { BubbleMenu as BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';

import CodeBlock from './blocks/code-block.vue';
import { BUBBLE_MENU_PLUGIN_KEYS } from '../model/config';
import { plugins } from '../lib/plugins';

const lowlight = createLowlight(all);

const bubbleMenus = Object.values(BUBBLE_MENU_PLUGIN_KEYS).map(pluginKey =>
  BubbleMenuPlugin.configure({
    pluginKey,
  }),
);

const editor = new Editor({
  extensions: [
    ...plugins,
    ...bubbleMenus,
    CodeBlockLowlight.extend({
      addNodeView() {
        return VueNodeViewRenderer(CodeBlock);
      },
    }).configure({ lowlight }),
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

.tiptap ul[data-type="taskList"] {
  list-style: none;
  margin-left: 0;
  padding: 0;
}

.tiptap ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
}

.tiptap ul[data-type="taskList"] li>label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap ul[data-type="taskList"] li>div {
  flex: 1 1 auto;
}

.tiptap ul[data-type="taskList"] li>div p {
  margin: 0;
}
</style>
