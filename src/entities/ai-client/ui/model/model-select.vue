<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAiClient } from '../../composables/use-ai-client';

withDefaults(defineProps<{
  disabled?: boolean;
}>(), {
  disabled: false,
});

const { t } = useI18n();
const model = defineModel<string | undefined>();

const { models } = useAiClient();
</script>

<template>
  <select
    v-model="model"
    class="select"
    :disabled="disabled || !models?.length"
  >
    <option
      disabled
      selected
      :value="undefined"
    >
      {{ t('chooseAi') }}
    </option>
    <option
      v-for="item of models"
      :key="item.name"
      :value="item.name"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<i18n>
{
  "en": {
    "chooseAi": "choose an ai model"
  },
  "ru": {
    "chooseAi": "выберите ии модель"
  }
}
</i18n>
