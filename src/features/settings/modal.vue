<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { SavedPromptsList, SettingsForm as SettingsFormAiClient } from '@/entities/ai-client';
import Modal from '@/shared/ui/modal.vue';
import ErrorsToggler from '@/shared/ui/toaster/errors-toggler.vue';
import Fieldset from '@/shared/ui/fieldset.vue';

const { t } = useI18n();
</script>

<template>
  <Modal>
    <template #trigger="{ toggle }">
      <button
        :title="t('openSettings')"
        :aria-label="t('openSettings')"
        class="cursor-pointer"
        @click="toggle"
      >
        <VueIcon
          name="lu:settings"
          class="text-2xl"
        />
      </button>
    </template>
    <template #content>
      <SettingsFormAiClient/>
      <SavedPromptsList/>
      <Fieldset :legend="t('uiSettings')">
        <ErrorsToggler/>
      </Fieldset>
    </template>
  </Modal>
</template>

<i18n>
{
  "en": {
    "openSettings": "Open settings",
    "uiSettings": "UI settings"
  },
  "ru": {
    "openSettings": "Открыть настройки",
    "uiSettings": "Настройки интерфейса"
  }
}
</i18n>
