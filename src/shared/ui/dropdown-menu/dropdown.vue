<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { autoPlacement, autoUpdate, offset, useFloating } from '@floating-ui/vue';

const dropdown = useTemplateRef('dropdown');
const trigger = useTemplateRef('trigger');

const isVisible = ref(false);

const { floatingStyles } = useFloating(trigger, dropdown, {
  middleware: [
    offset(8),
    autoPlacement({
      allowedPlacements: ['bottom-start', 'bottom-end', 'left-start', 'left-end'],
    }),
  ],
  whileElementsMounted: autoUpdate,
});

const toggle = () => {
  isVisible.value = !isVisible.value;
};

const close = () => {
  isVisible.value = false;
};
</script>

<template>
  <div>
    <div
      ref="trigger"
      @click="toggle"
      class="inline-block"
    >
      <slot
        name="trigger"
        :toggle="toggle"
        :is-visible="isVisible"
      />
    </div>

    <ul
      class="not-prose menu bg-base-300 p-0 rounded-box shadow-sm max-h-40 overflow-auto z-50 dropdown"
      v-if="isVisible"
      ref="dropdown"
      :style="floatingStyles"
    >
      <slot :close="close" />
    </ul>
  </div>
</template>
