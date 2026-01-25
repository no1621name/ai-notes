<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useDrawerHide } from '@/shared/composables/use-drawer-hide';

const { getHide } = useDrawerHide();
const hide = getHide();
const { t } = useI18n();

defineProps<{
  tootlip?: string;
}>();
</script>

<template>
  <div class="flex flex-col h-full">
    <header class="p-2 border-b border-b-base-300 relative flex-none">
      <div class="max-w-[90%]">
        <slot name="header" />
      </div>
      <button
        class="absolute top-4 right-4 cursor-pointer"
        @click="hide"
        :aria-label="t('actions.close')"
        :title="t('actions.close')"
      >
        <VueIcon name="lu:x" />
      </button>
    </header>
    <div
      class="flex flex-col h-max flex-1"
      :class="{'tooltip': !!tootlip, 'overflow-auto': !tootlip}"
    >
      <span v-if="tootlip" class="tooltip-content">{{ tootlip }}</span>
      <div v-if="$slots.toolbar" class="p-2 flex-none border-b border-b-base-300">
        <slot name="toolbar" />
      </div>
      <main class="p-2 overflow-y-auto flex flex-col h-full">
        <slot />
      </main>
    </div>
  </div>
</template>
