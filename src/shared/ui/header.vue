<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import ThemeController from './theme-controller.vue';
import LanguageSelect from './language-select.vue';
import { useIsMobile } from '../composables/use-media-query';

const { t, locale } = useI18n();
const isMobile = useIsMobile();
</script>

<template>
  <header class="sticky bg-base-300 z-10 rounded-b-2xl top-0 w-full p-4 flex justify-between items-center">
    <RouterLink
      :to="{ name: 'home', params: { locale: $i18n.locale } }"
      :title="t('pages.home')"
      :aria-label="t('pages.home')"
    >
      <h1 class="text-2xl font-mono">AINotes</h1>
    </RouterLink>

    <div class="flex items-center gap-2 text-2xl">
      <div v-if="!isMobile" class="contents">
        <RouterLink
          :to="{ name: 'info', params: { locale } }"
          :title="t('pages.info')"
          :aria-label="t('pages.info')"
        >
          <VueIcon name="lu:info"/>
        </RouterLink>
        <slot name="actions"/>
      </div>
      <ThemeController/>
      <LanguageSelect/>
    </div>
  </header>

  <nav
    v-if="isMobile"
    class="fixed bottom-0 left-0 w-full bg-base-300 z-10 py-4 px-2 flex justify-around items-center rounded-t-2xl text-2xl"
  >
    <RouterLink
      :to="{ name: 'info', params: { locale } }"
      :title="t('pages.info')"
      :aria-label="t('pages.info')"
    >
      <VueIcon name="lu:info"/>
    </RouterLink>
    <slot name="actions"/>
  </nav>
</template>
