<script lang="ts" setup>
import { inject } from 'vue';
import { DEFAULT_ACTIONS } from '../../model/config';
import { editorInjectionKey } from '../../model/keys';
import ActionButton from '../base/action-button.vue';

const editor = inject(editorInjectionKey);
</script>

<template>
  <div
    v-if="editor?.editor"
    class="flex gap-2 flex-wrap items-center"
  >
    <ActionButton
      v-for="action in DEFAULT_ACTIONS"
      :key="action.id"
      :action="action"
      :editor="editor.editor"
    />
  </div>
</template>
