<script lang="ts" setup>
import { BubbleMenu } from '@tiptap/vue-3/menus';

import { BUBBLE_MENU_PLUGIN_KEYS } from '../model/config';
import type { EditorInstanceType, EditorBubbleMenuOptions, EditorBubbleMenuNames } from '../model/types';

withDefaults(
  defineProps<{
    editor?: EditorInstanceType;
    pluginKeyName?: EditorBubbleMenuNames;
    menuOptions?: Partial<EditorBubbleMenuOptions>;
  }>(),
  { pluginKeyName: 'main' },
);
</script>

<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
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
