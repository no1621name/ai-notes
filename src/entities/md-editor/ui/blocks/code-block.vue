<script lang="ts" setup>
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps(nodeViewProps);
const languages = props.extension.options.lowlight.listLanguages();

const selectedLanguage = computed<string>({
  get() {
    return props.node.attrs.language;
  },
  set(language) {
    props.updateAttributes({
      language,
    });
  },
});
</script>

<template>
  <NodeViewWrapper as="pre" class="flex relative">
    <code><node-view-content /></code>
    <select
      v-model="selectedLanguage"
      class="w-max select select-xs absolute top-2 right-2"
      :aria-label="t('programmingLanguage')"
    >
      <option :value="null">auto</option>
      <option disabled>—</option>
      <option
        v-for="language in languages"
        :value="language"
        :key="language"
      >
        {{ language }}
      </option>
    </select>
  </NodeViewWrapper>
</template>

<i18n>
{
  "en": {
    "programmingLanguage": "Programming language"
  },
  "ru": {
    "programmingLanguage": "Язык программирования"
  }
}
</i18n>
