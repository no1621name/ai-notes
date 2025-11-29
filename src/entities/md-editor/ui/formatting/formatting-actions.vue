<script lang="ts" setup>
import { inject } from 'vue';
import { DEFAULT_FORMATTING_ACTIONS, DEFAULT_ADDITIONAL_ACTIONS } from '../../model/config';
import { editorInjectionKey } from '../../model/keys';
import ActionButton from '../base/action-button.vue';

const editor = inject(editorInjectionKey);

const actions = [...DEFAULT_FORMATTING_ACTIONS, ...Object.values(DEFAULT_ADDITIONAL_ACTIONS)];
</script>

<template>
  <div v-if="editor?.editor" class="flex gap-2 flex-wrap items-center">
    <ActionButton
      v-for="action in actions"
      :key="action.id"
      :action="action"
      :editor="editor.editor"
    />
  </div>
</template>
