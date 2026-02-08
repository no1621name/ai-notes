<script setup lang="ts">
import type { Tag } from '../model/types';

withDefaults(
  defineProps<{
    tag: Tag;
    outline?: boolean;
  }>(),
  {
    outline: false,
  },
);
</script>

<template>
  <div
    class="badge badge-sm sm:badge-md leading-0 tag-badge"
    :class="{ outline }"
    :style="{ '--tag-color': tag.color }"
  >
    <span class="contrasted-text">
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

<style scoped lang="postcss">
.tag-badge {
  background-color: var(--tag-color);
  user-select: none;
}

.tag-badge.outline {
  border: 1px solid var(--tag-color);
  color: var(--tag-color);
  background-color: transparent;
}

.tag-badge.outline .contrasted-text {
  filter: none;
  mix-blend-mode: unset;
}

.contrasted-text {
  filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
  mix-blend-mode: luminosity;
  color: var(--tag-color);
}
</style>
