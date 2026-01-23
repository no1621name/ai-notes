<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { SavedPromptsList, SettingsForm as SettingsFormAiClient } from '@/entities/ai-client';
import Modal from '@/shared/ui/modal.vue';

const { t } = useI18n();
</script>

<template>
  <Modal>
    <template #trigger="{ toggle }">
      <button
        :title="t('openSettings')"
        :aria-label="t('openSettings')"
      >
        <VueIcon

          name="lu:settings"
          class="text-2xl cursor-pointer"
          @click="toggle"
        />
      </button>
    </template>
    <template #content>
      <SettingsFormAiClient/>
      <SavedPromptsList/>
    </template>
  </Modal>
</template>

<i18n>
{
  "en": {
    "openSettings": "Open settings"
  },
  "ru": {
    "openSettings": "Открыть настройки"
  }
}
</i18n>
