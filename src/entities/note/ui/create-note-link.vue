<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import BaseCard from './base-card.vue';

const { t } = useI18n();
</script>

<template>
  <BaseCard
    :to="{
      name: 'note-create'
    }"
    class="transition-shadow shadow-xl hover:shadow-accent-content"
  >
    <h2 class="card-title break-all m-auto">
      <VueIcon name="lu:circle-plus"/>
      {{ t('createNote') }}
    </h2>
  </BaseCard>
</template>

<i18n>
{
  "en": {
    "createNote": "Create new note"
  },
  "ru": {
    "createNote": "Создать новую заметку"
  }
}
</i18n>
