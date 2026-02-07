<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { useTheme } from '../composables/use-theme';

const { t } = useI18n();
const currentTheme = useTheme();
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
