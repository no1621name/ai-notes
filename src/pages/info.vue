<script setup lang="ts">
import { ref, watch } from 'vue';
import { marked } from 'marked';
import { useI18n } from 'vue-i18n';

const { locale, fallbackLocale } = useI18n();
const readmeHtml = ref<string>('');

const loadReadme = async (currentLocale: string) => {
  const isFallbackLocale = currentLocale === fallbackLocale.value;
  const localizedPath = `/README.${currentLocale}.md?raw`;
  const fallbackPath = '/README.md?raw';

  const tryLoad = async (path: string): Promise<string | null> => {
    try {
      const module = await fetch(path).then(res => res.text());
      return marked.parse(module) as string;
    } catch {
      return '';
    }
  };

  readmeHtml.value
    = (!isFallbackLocale ? await tryLoad(localizedPath) : null)
      ?? (await tryLoad(fallbackPath))
      ?? '<p>Failed to load README content</p>';
};

watch(locale, newLocale => loadReadme(newLocale), { immediate: true });
</script>

<template>
  <div class="prose max-w-full m-4" v-html="readmeHtml" />
</template>
