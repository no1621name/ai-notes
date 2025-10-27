<script lang="ts" setup>
import { BubbleMenu } from '@tiptap/vue-3/menus';
import { inject } from 'vue';

import type { EditorBubbleMenuOptions, EditorBubbleMenuNames } from '../../model/types';
import { BUBBLE_MENU_PLUGIN_KEYS } from '../../model/config';
import { editorInjectionKey } from '../../model/keys';

withDefaults(
  defineProps<{
    pluginKeyName?: EditorBubbleMenuNames;
    menuOptions?: Partial<EditorBubbleMenuOptions>;
  }>(),
  { pluginKeyName: 'main' },
);

const editorRef = inject(editorInjectionKey);
</script>

<template>
  <BubbleMenu
    v-if="editorRef"
    :editor="editorRef?.editor"
    :options="{
      placement: 'bottom',
      offset: 8,
      flip: true,
      ...menuOptions,
    }"
    :plugin-key="BUBBLE_MENU_PLUGIN_KEYS[pluginKeyName]"
  >
    <div class="bg-base-200 py-1 px-2 rounded-box shadow-sm">
      <slot/>
    </div>
  </BubbleMenu>
</template>
