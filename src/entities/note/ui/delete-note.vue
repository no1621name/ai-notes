<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

defineProps<{
  loading?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    class="btn btn-square btn-sm text-lg hover:btn-error"
    :disabled="loading"
    @click.prevent.stop="$emit('click')"
  >
    <VueIcon
      v-if="loading"
      name="lu:loader"
      class="animate-spin"
    />
    <VueIcon v-else name="lu:trash"/>
  </button>
</template>
