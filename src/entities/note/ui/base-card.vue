<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  to?: RouteLocationRaw;
}>();

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
  >
    <div class="card-body">
      <slot/>
    </div>
  </component>
</template>
