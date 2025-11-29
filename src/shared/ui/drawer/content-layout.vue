<script setup lang="ts">
import { inject } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { DRAWER_HIDE_INJECTION_KEY } from '@/shared/constants/drawer';

const hide = inject(DRAWER_HIDE_INJECTION_KEY);
</script>

<template>
  <div class="flex flex-col h-full">
    <header class="p-2 border-b border-b-base-300 relative flex-none">
      <div class="max-w-[90%]">
        <slot name="header" />
      </div>
      <button class="absolute top-4 right-4 cursor-pointer" @click="hide">
        <VueIcon name="lu:x" />
      </button>
    </header>
    <div v-if="$slots.toolbar" class="p-2 flex-none border-b border-b-base-300">
      <slot name="toolbar" />
    </div>
    <main class="p-2 overflow-y-auto flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
