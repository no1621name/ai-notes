<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAiHelper } from '../composables/use-ai-helper';

const { toggleAiHelper } = useAiHelper();
const { t } = useI18n();
</script>

<template>
  <button class="btn btn-soft btn-sm" @click.stop="toggleAiHelper">
    {{ t('aiHelper') }}
  </button>
</template>

<i18n>
{
  "en": {
    "aiHelper": "AI helper"
  },
  "ru": {
    "aiHelper": "ИИ помощник"
  }
}
</i18n>
