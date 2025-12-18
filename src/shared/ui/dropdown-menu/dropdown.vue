<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { autoPlacement, autoUpdate, offset, useFloating } from '@floating-ui/vue';
import Menu from './menu.vue';

const dropdown = useTemplateRef('dropdown');
const trigger = useTemplateRef('trigger');

const isVisible = ref(false);

const { floatingStyles } = useFloating(trigger, dropdown, {
  middleware: [
    offset(8),
    autoPlacement({
      allowedPlacements: ['bottom-start', 'left-start'],
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
      v-click-outside="close"
      class="inline-block"
    >
      <slot
        name="trigger"
        :toggle="toggle"
        :is-visible="isVisible"
      />
    </div>

    <Menu
      v-if="isVisible"
      ref="dropdown"
      :style="floatingStyles"
      class="z-50 dropdown"
    >
      <slot :close="close" />
    </Menu>
  </div>
</template>
