<script setup lang="ts">
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import type { EditorAction } from '../model/types';
import { useAddQuickAction } from '../queries/use-add-quick-action';
import { useRemoveQuickAction } from '../queries/use-remove-quick-action';

const props = defineProps<{
  actionId: EditorAction['id'];
  isSelected: boolean;
}>();

const { mutate: addQuickAction } = useAddQuickAction();
const { mutate: removeQuickAction } = useRemoveQuickAction();

const clickHandler = (event: Event) => {
  event.stopPropagation();

  if (props.isSelected) {
    removeQuickAction(props.actionId);
    return;
  }

  addQuickAction(props.actionId);
};
</script>

<template>
  <button @click="clickHandler" class="text-xl cursor-pointer hover:[&>*]:opacity-70">
    <VueIcon name="an:filled-star" v-if="isSelected" />
    <VueIcon name="an:outlined-star" v-else/>
  </button>
</template>
