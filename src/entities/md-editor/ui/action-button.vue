<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { useI18n } from 'vue-i18n';

import type { EditorAction, EditorInstanceType } from '../model/types';

defineProps<{
  editor?: EditorInstanceType;
  action: EditorAction;
}>();

const { t } = useI18n();
</script>

<template>
  <button
    v-if="editor"
    class="btn btn-sm"
    @click="action.action(editor)"
    :class="{ 'btn-primary': action.isActive(editor) }"
    :title="t(action.label)"
    :disabled="action.isDisabled?.(editor) ?? false"
  >
    <VueIcon :name="action.icon" />
  </button>
</template>
