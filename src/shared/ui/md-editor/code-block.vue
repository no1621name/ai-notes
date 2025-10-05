<script lang="ts" setup>
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3';
import { computed } from 'vue';

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
  <NodeViewWrapper>
    <pre class="flex relative">
      <code><node-view-content /></code>
      <select class="w-max select select-xs absolute top-2 right-2" v-model="selectedLanguage">
        <option :value="null">auto</option>
        <option disabled>—</option>
        <option v-for="language in languages" :value="language" :key="language">
          {{ language }}
        </option>
    </select>
    </pre>
  </NodeViewWrapper>
</template>
