<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { DEFAULT_THEME, THEME_KEY } from '../constants/theme';

const currentTheme = ref(DEFAULT_THEME);

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  currentTheme.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
});

watch(currentTheme, (newTheme) => {
  localStorage.setItem(THEME_KEY, newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
});
</script>

<template>
  <label class="swap swap-rotate">
    <input
      v-model="currentTheme"
      type="checkbox"
      class="theme-controller"
      true-value="dark"
      false-value="light"
    >

    <VueIcon name="lu:sun" class="swap-off text-2xl"/>
    <VueIcon name="lu:moon" class="swap-on text-2xl"/>
  </label>
</template>
