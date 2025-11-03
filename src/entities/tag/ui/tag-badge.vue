<script setup lang="ts">
import type { Tag } from '../model/types';

defineProps<{
  tag: Tag;
}>();
</script>

<template>
  <div
    class="badge leading-0"
    :style="{ backgroundColor: tag.color }"
  >
    <span class="contrasted-text" :style="{color: tag.color}">
      {{ tag.name }}
    </span>
    <div
      v-if="$slots.action"
      class="ml-1 pl-2 border-l contrasted-text"
      :style="{color: tag.color}"
    >
      <slot name="action"/>
    </div>
  </div>
</template>

<style scoped>
.contrasted-text {
  filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
  mix-blend-mode: luminosity;
}
</style>
