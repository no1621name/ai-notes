<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useToggleSearchPopup } from '../composables/use-toggle-search-popup';

const { t } = useI18n();
const { toggle } = useToggleSearchPopup();
</script>

<template>
  <button
    class="btn btn-xs sm:btn-sm btn-square"
    :title="t('search')"
    :aria-label="t('search')"
    @click="toggle"
  >
    <VueIcon name="lu:search"/>
  </button>
</template>

<i18n>
{
  "en": {
    "search": "Search"
  },
  "ru": {
    "search": "Поиск"
  }
}
</i18n>
