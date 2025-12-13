<script lang="ts" setup>
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import { BubbleMenu as BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import { Placeholder } from '@tiptap/extensions';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';

import { BUBBLE_MENU_PLUGIN_KEYS } from '../../model/config';
import { plugins } from '@/shared/lib/tiptap/plugins';
import EditorSkeleton from './editor-skeleton.vue';
import CodeBlock from './../blocks/code-block.vue';
import { onBeforeMount, shallowRef } from 'vue';

const props = withDefaults(defineProps<{ placeholder?: string; skeleton?: boolean; contentSkeleton?: boolean }>(), {
  placeholder: 'Write something',
  skeleton: false,
});

const bubbleMenus = Object.values(BUBBLE_MENU_PLUGIN_KEYS).map(pluginKey =>
  BubbleMenuPlugin.configure({
    pluginKey,
  }),
);

const editor = shallowRef<Editor | undefined>(undefined);

onBeforeMount(async () => {
  const { createLowlight, common } = await import('lowlight');
  const lowlight = createLowlight(common);

  editor.value = new Editor({
    extensions: [
      ...plugins,
      ...bubbleMenus,
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return VueNodeViewRenderer(CodeBlock);
        },
      }).configure({ lowlight }),
    ],
  });
});

defineExpose({ editor });
</script>

<template>
  <div class="relative w-full h-full flex flex-col">
    <EditorSkeleton v-if="skeleton || !editor"/>
    <EditorContent
      v-else
      :editor="editor"
      class="max-w-full editor-prose prose prose-p:my-2 prose-blockquote:alert prose-h2:mt-6 prose-h3:mt-4 flex-1 flex flex-col"
    />
  </div>
</template>

<style>
.tiptap {
  border: none;
  height: 100%;
  outline: none;
}

.tiptap:focus {
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
  color: var(--color-base-content);
  opacity: 0.5;
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
