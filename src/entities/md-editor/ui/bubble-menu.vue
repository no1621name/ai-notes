<script lang="ts" setup>
import { BubbleMenu } from '@tiptap/vue-3/menus';

import type { EditorBubbleMenuOptions, EditorBubbleMenuNames } from '../model/types';
import { BUBBLE_MENU_PLUGIN_KEYS } from '../model/config';
import { useEditor } from '../composables/use-editor';

withDefaults(
  defineProps<{
    pluginKeyName?: EditorBubbleMenuNames;
    menuOptions?: Partial<EditorBubbleMenuOptions>;
  }>(),
  { pluginKeyName: 'main' },
);

const { getEditor } = useEditor();
const editorRef = getEditor();
</script>

<template>
  <BubbleMenu
    v-if="editorRef?.editor"
    :editor="editorRef?.editor"
    :options="{
      flip: true,
      offset: 8,
      placement: 'bottom-start',
      ...menuOptions,
    }"
    :plugin-key="BUBBLE_MENU_PLUGIN_KEYS[pluginKeyName]"
  >
    <div class="bg-base-300 py-1 px-2 rounded-box shadow-sm z-[1] relative">
      <slot/>
    </div>
  </BubbleMenu>
</template>
