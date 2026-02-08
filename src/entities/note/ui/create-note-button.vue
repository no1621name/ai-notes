<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

const { t, locale } = useI18n();
</script>

<template>
  <RouterLink
    class="btn btn-circle btn-primary shadow-lg"
    :to="{ name: 'note-create', params: { locale } }"
    :aria-label="t('createNote')"
    :title="t('createNote')"
  >
    <VueIcon name="lu:plus" class="text-2xl" />
  </RouterLink>
</template>
