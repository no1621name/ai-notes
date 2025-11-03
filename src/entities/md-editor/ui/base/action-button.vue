<script lang="ts" setup>
import Button from '@/shared/ui/button.vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import type { EditorAction, EditorInstanceType } from '../../model/types';

defineProps<{
  editor?: EditorInstanceType;
  action: EditorAction;
}>();
</script>

<template>
  <Button
    v-if="editor"
    class="btn-sm"
    @click="action.action(editor)"
    :class="{ 'btn-primary': action.isActive(editor) }"
    :disabled="action.isDisabled?.(editor) ?? false"
  >
    <VueIcon :name="action.icon" />
  </Button>
</template>
