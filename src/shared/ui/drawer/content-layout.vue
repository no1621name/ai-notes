<script setup lang="ts">
import { inject } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { DRAWER_HIDE_INJECTION_KEY } from '@/shared/constants/drawer';

const hide = inject(DRAWER_HIDE_INJECTION_KEY);
</script>

<template>
  <header class="p-4 border-b border-b-base-300 relative">
    <div class="max-w-[90%]">
      <slot name="header" />
    </div>
    <button class="absolute top-4 right-4 cursor-pointer" @click="hide">
      <VueIcon name="lu:x" />
    </button>
  </header>
  <main class="p-4 overflow-y-auto">
    <slot />
  </main>
</template>
