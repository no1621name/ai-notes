<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { autoPlacement, autoUpdate, offset, useFloating, type Placement } from '@floating-ui/vue';
import Menu from './menu.vue';

const props = withDefaults(defineProps<{
  allowedPlacements?: Placement[];
  menuClass?: string;
}>(), {
  allowedPlacements: () => ['bottom-start', 'left-start'],
});

const dropdown = useTemplateRef('dropdown');
const trigger = useTemplateRef('trigger');

const isVisible = ref(false);

const { floatingStyles } = useFloating(trigger, dropdown, {
  middleware: [
    offset(8),
    autoPlacement({
      allowedPlacements: props.allowedPlacements,
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
  <div v-click-outside="close">
    <div
      ref="trigger"
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
      :class="menuClass"
    >
      <slot :close="close" />
    </Menu>
  </div>
</template>
