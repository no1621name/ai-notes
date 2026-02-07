<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import BaseCard from './base-card.vue';

const { t } = useI18n();
</script>

<template>
  <BaseCard
    class="transition-shadow shadow-xl hover:shadow-accent-content"
    :to="{ name: 'note-create' }"
  >
    <h2 class="card-title break-all m-auto">
      <VueIcon name="lu:circle-plus"/>
      {{ t('createNote') }}
    </h2>
  </BaseCard>
</template>
