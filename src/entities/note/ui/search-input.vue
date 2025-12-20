<script lang="ts" setup>
import { nextTick, ref, useTemplateRef } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { debounce } from '@/shared/lib/debounce';

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
    <button class="btn" @click="toggleVisible">
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
          placeholder="Write to search..."
          :value="search"
          @input="event => handleUpdate((event.target as HTMLInputElement).value)"
        >
      </div>
    </Transition>
  </div>
</template>
