<script lang="ts" setup>
import ThemeController from '@/shared/ui/theme-controller.vue';
</script>

<template>
  <header class="sticky bg-base-300 z-10 rounded-b-2xl top-0 w-full p-4 flex justify-between items-center">
    <RouterLink to="/">
      <h1 class="text-2xl font-mono">AINotes</h1>
    </RouterLink>

    <div class="flex items-center gap-2">
      <ThemeController/>
      <slot name="actions"/>
    </div>
  </header>
</template>
