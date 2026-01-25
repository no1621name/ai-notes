<script lang="ts" setup>
import { AVAILABLE_LOCALES, LANGUAGE_NAMES } from '@/app/providers/i18n';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { push, currentRoute } = useRouter();
const { locale, t } = useI18n();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;

  push({
    name: currentRoute.value.name,
    params: {
      ...currentRoute.value.params,
      locale: target.value,
    },
  });
};
</script>

<template>
  <select
    class="select select-sm"
    v-model="locale"
    :aria-label="t('languageSelect')"
    @change="handleChange"
  >
    <option
      v-for="locale in AVAILABLE_LOCALES"
      :key="`locale-${locale}`"
      :value="locale"
    >
      {{ LANGUAGE_NAMES[locale] }}
    </option>
  </select>
</template>

<i18n>
{
  "en": {
    "languageSelect": "Language"
  },
  "ru": {
    "languageSelect": "Язык"
  }
}
</i18n>
