<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { DEFAULT_THEME, THEME_KEY } from '../constants/theme';
import { onBroadcastMessage, sendBroadcastMessage } from '../lib/broadcast';

const currentTheme = ref(DEFAULT_THEME);
let themeSynced = false;

const { t } = useI18n();

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  currentTheme.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);

  onBroadcastMessage<string>('theme-changed', (event) => {
    currentTheme.value = event;
    themeSynced = true;
  });
});

watch(currentTheme, (newTheme) => {
  localStorage.setItem(THEME_KEY, newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);

  if (themeSynced) {
    themeSynced = false;
    return;
  }

  sendBroadcastMessage<string>('theme-changed', newTheme);
});
</script>

<template>
  <label
    class="swap swap-rotate"
    :title="t('toggleTheme')"
    :aria-label="t('toggleTheme')"
  >
    <input
      v-model="currentTheme"
      type="checkbox"
      class="theme-controller"
      true-value="dark"
      false-value="light"
    >

    <VueIcon name="lu:sun" class="swap-off"/>
    <VueIcon name="lu:moon" class="swap-on"/>
  </label>
</template>

<i18n>
{
  "en": {
    "toggleTheme": "Toggle theme"
  },
  "ru": {
    "toggleTheme": "Сменить тему"
  }
}
</i18n>
