<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

const { t } = useI18n();

defineProps<{
  loading?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    class="btn btn-square btn-sm text-lg hover:btn-error"
    :disabled="loading"
    :aria-label="t('actions.delete')"
    :title="t('actions.delete')"
    @click.prevent.stop="$emit('click')"
  >
    <VueIcon
      v-if="loading"
      name="lu:loader"
      class="animate-spin"
    />
    <VueIcon v-else name="lu:trash"/>
  </button>
</template>
