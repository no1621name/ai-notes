<script lang="ts" setup>
import { BubbleMenu } from '@tiptap/vue-3/menus';

import type { EditorBubbleFloatingOptions, EditorBubbleMenuNames } from '../model/types';
import { BUBBLE_MENU_PLUGIN_KEYS } from '../model/config';
import { useEditor } from '../composables/use-editor';
import { toRef, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    pluginKeyName?: EditorBubbleMenuNames;
    floatingOptions?: Partial<EditorBubbleFloatingOptions>;
    shouldShow?: boolean;
  }>(),
  {
    shouldShow: true,
    pluginKeyName: 'main',
  },
);
const shouldShow = toRef(props, 'shouldShow');

const { editor } = useEditor();
watch(shouldShow, () => {
  editor.value?.commands.setMeta('bubbleMenu', 'updatePosition');
});
</script>

<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :options="{
      flip: true,
      offset: 8,
      placement: 'bottom-start',
      ...floatingOptions,
    }"
    :plugin-key="BUBBLE_MENU_PLUGIN_KEYS[pluginKeyName]"
  >
    <div v-if="shouldShow" class="bg-base-300 py-1 px-2 rounded-box shadow-sm z-[1] relative">
      <slot/>
    </div>
  </BubbleMenu>
</template>
