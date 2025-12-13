<script lang="ts" setup>
import { ref } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { debounce } from '@/shared/lib/debounce';
import Button from '@/shared/ui/button.vue';

const search = ref('');
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
</script>

<template>
  <div class="flex gap-2">
    <Button @click="isVisible = !isVisible">
      <VueIcon :name="isVisible ? 'lu:x' : 'lu:search'"/>
    </Button>
    <Transition name="fade-up">
      <div
        class="join"
        v-if="isVisible"
      >
        <input
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
