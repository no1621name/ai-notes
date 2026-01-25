<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useToasterStore } from '@/app/stores/toaster';

const store = useToasterStore();
const { t } = useI18n();
</script>

<template>
  <label class="label">
    <input
      type="checkbox"
      :checked="store.errorsShown"
      class="toggle"
      @change="store.errorsShown ? store.hideErrors() : store.showErrors()"
    >
    {{ t('showErrorMessages') }}
  </label>
</template>

<i18n>
{
  "en": {
    "showErrorMessages": "Show error messages"
  },
  "ru": {
    "showErrorMessages": "Показывать сообщения об ошибках"
  }
}
</i18n>
