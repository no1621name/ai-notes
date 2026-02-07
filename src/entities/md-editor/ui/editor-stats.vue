<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useEditor } from '../composables/use-editor';

const { t } = useI18n();
const { editor } = useEditor();
</script>

<template>
  <span v-if="!!editor" class="flex flex-col text-xs ml-auto sm:ml-0">
    <span>{{ t('chars') }}: {{ editor.storage.characterCount.characters() }}</span>
    <span>{{ t('words') }}: {{ editor.storage.characterCount.words() }}</span>
  </span>
</template>

<i18n>
{
  "en": {
    "chars": "chars",
    "words": "words"
  },
  "ru": {
    "chars": "символов",
    "words": "слов"
  }
}
</i18n>
