<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import type { EditorAction, EditorInstanceType } from '../model/types';

defineProps<{
  editor?: EditorInstanceType;
  action: EditorAction;
}>();
</script>

<template>
  <button
    v-if="editor"
    class="btn btn-sm"
    @click="action.action(editor)"
    :class="{ 'btn-primary': action.isActive(editor) }"
    :disabled="action.isDisabled?.(editor) ?? false"
  >
    <VueIcon :name="action.icon" />
  </button>
</template>
