<script lang="ts" setup>
import { nextTick, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { debounce } from '@/shared/lib/debounce';

const { t } = useI18n();

const search = ref('');
const serachInput = useTemplateRef<HTMLInputElement>('search-input');
const isVisible = ref(false);

const emit = defineEmits<{
  (e: 'update:search', value: string): void;
}>();

const updateSerach = (value: string) => {
  value = value.trim();
  search.value = value;
  emit('update:search', value);
};

const handleUpdate = debounce(updateSerach, 500);

const toggleVisible = async () => {
  isVisible.value = !isVisible.value;

  if (!isVisible.value) {
    search.value = '';
    emit('update:search', '');
  } else {
    await nextTick();
    serachInput.value?.focus();
  }
};
</script>

<template>
  <div class="flex gap-2">
    <button
      class="btn"
      @click="toggleVisible"
      :aria-label="isVisible ? t('actions.close') : t('actions.search')"
      :title="isVisible ? t('actions.close') : t('actions.search')"
    >
      <VueIcon :name="isVisible ? 'lu:x' : 'lu:search'"/>
    </button>
    <Transition name="fade-up">
      <div
        class="join"
        v-if="isVisible"
      >
        <input
          ref="search-input"
          type="text"
          class="input join-item"
          :placeholder="t('placeholder')"
          :value="search"
          @input="event => handleUpdate((event.target as HTMLInputElement).value)"
        >
      </div>
    </Transition>
  </div>
</template>

<i18n>
{
  "en": {
    "placeholder": "Write to search..."
  },
  "ru": {
    "placeholder": "Напишите для поиска..."
  }
}
</i18n>
