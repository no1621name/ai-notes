<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import type { SavedPrompt } from '../../model/types';

withDefaults(defineProps<{
  prompt: SavedPrompt;
  showActions?: boolean;
  selected?: boolean;
  disabled?: boolean;
}>(), {
  showActions: false,
  selected: false,
  disabled: false,
});

defineEmits<{
  (e: 'click'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();
</script>

<template>
  <p
    class="badge"
    :class="{
      'badge-primary': selected,
      'pointer-events-none badge-dash opacity-70': disabled,
      'badge-soft': !disabled,
    }"
    @click="$emit('click')"
  >
    {{ prompt.name }}

    <template v-if="showActions">
      <VueIcon
        class="cursor-pointer"
        name="lu:pencil-line"

        @click="$emit('edit')"
      />
      <VueIcon
        class="cursor-pointer"
        name="lu:trash"
        @click="$emit('delete')"
      />
    </template>
  </p>
</template>
