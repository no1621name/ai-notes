<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <textarea
    class="resize-none border-none w-full outline-none placeholder:italic placeholder:opacity-50 placeholder:text-base-content"
    disabled
    :placeholder="t('placeholders.editor')"
  />
</template>
