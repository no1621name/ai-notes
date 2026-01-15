<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import ThemeController from '@/shared/ui/theme-controller.vue';
import LanguageSelect from './language-select.vue';
</script>

<template>
  <header class="sticky bg-base-300 z-10 rounded-b-2xl top-0 w-full p-4 flex justify-between items-center">
    <RouterLink
      :to="{ name: 'home', params: { locale: $i18n.locale } }"
      title="Home page"
      aria-label="Home page"
    >
      <h1 class="text-2xl font-mono">AINotes</h1>
    </RouterLink>

    <div class="flex items-center gap-2 text-2xl">
      <RouterLink
        :to="{ name: 'info', params: { locale: $i18n.locale } }"
        title="Info page"
        aria-label="Info page"
      >
        <VueIcon name="lu:info"/>
      </RouterLink>
      <ThemeController/>
      <slot name="actions"/>
      <LanguageSelect/>
    </div>
  </header>
</template>
