<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import ConfirmForm from '@/shared/ui/confirm-form.vue';

const { t } = useI18n();

defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const isDeleting = ref(false);

const handleDelete = () => {
  emit('click');
  isDeleting.value = false;
};
</script>

<template>
  <div @click.prevent="">
    <ConfirmForm
      v-if="isDeleting"
      mode="error"
      @submit="handleDelete"
      @close="isDeleting = false"
    >
      <template #message>
        {{ t('deleteConfirm') }}
      </template>
      <template #submit-text>
        {{ t('actions.delete') }}
      </template>
    </ConfirmForm>

    <button
      v-else
      class="btn btn-square btn-sm text-lg hover:btn-error"
      :disabled="loading"
      :aria-label="t('actions.delete')"
      :title="t('actions.delete')"
      @click="isDeleting = true"
    >
      <VueIcon
        v-if="loading"
        name="lu:loader"
        class="animate-spin"
      />
      <VueIcon v-else name="lu:trash"/>
    </button>
  </div>
</template>

<i18n>
{
  "en": {
    "deleteConfirm": "Delete this note?"
  },
  "ru": {
    "deleteConfirm": "Удалить эту заметку?"
  }
}
</i18n>
