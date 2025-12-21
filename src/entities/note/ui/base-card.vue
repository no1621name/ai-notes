<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const props = withDefaults(defineProps<{
  to?: RouteLocationRaw;
  disabled?: boolean;
}>(), {
  disabled: false,
});

const component = computed(() => {
  return props.to ? RouterLink : 'div';
});

const componentProps = computed(() => {
  return props.to ? { to: props.to } : {};
});
</script>

<template>
  <component
    :is="component"
    v-bind="componentProps"
    class="card bg-base-200 shadow-xl h-full"
    :class="{ 'pointer-events-none': disabled }"
  >
    <div class="card-body">
      <slot/>
    </div>
  </component>
</template>
