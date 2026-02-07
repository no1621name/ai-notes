<script lang="ts" setup>
import { nextTick, ref, useTemplateRef, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { debounce } from '@/shared/lib/debounce';
import { useIsMobile } from '@/shared/composables/use-media-query';

const { t } = useI18n();

const search = ref('');
const serachInput = useTemplateRef<HTMLInputElement>('search-input');
const isMobile = useIsMobile();
const isVisible = ref(false);

const buttonTitle = computed(() => isVisible.value ? t('actions.close') : t('actions.search'));

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
  <div class="flex items-center" :class="{ 'gap-2': isMobile }">
    <button
      class="btn"
      :class="{ 'btn-ghost btn-square pointer-events-none btn-sm': isMobile }"
      @click="toggleVisible"
      :aria-label="buttonTitle"
      :title="buttonTitle"
    >
      <VueIcon :name="isVisible ? 'lu:x' : 'lu:search'"/>
    </button>
    <Transition name="fade-up">
      <div
        class="join"
        :class="{ 'w-full': isMobile }"
        v-if="isVisible || isMobile"
      >
        <input
          ref="search-input"
          type="text"
          class="input join-item flex-1"
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
