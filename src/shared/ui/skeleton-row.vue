<script lang="ts" setup>
withDefaults(defineProps<{
  count?: number;
  height?: number;
  width?: number;
}>(), {
  count: 3,
  height: 8,
});
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton"
      :style="{
        height: `${height}px`,
        width: `${width ? width : (i%3+1) * 48}px`
      }"
    />
  </div>
</template>
