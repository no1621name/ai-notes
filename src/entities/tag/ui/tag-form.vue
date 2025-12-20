<script setup lang="ts">
import { ref, toRefs, onMounted, computed, nextTick } from 'vue';
import { useRegleSchema } from '@regle/schemas';
import { type } from 'arktype';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import ErrorMessage from '@/shared/ui/error-message.vue';
import { getRandomItem } from '@/shared/lib/get-random-item';
import { predefinedColors } from '../model/constants';
import type { Tag } from '../model/types';

export interface SubmitPayloadBody {
  id?: Tag['id'];
  name: string;
  color: string;
}

const props = defineProps<{
  tag?: Tag;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { id?: Tag['id']; name: string; color: string }): void;
  (e: 'close'): void;
}>();

const { tag } = toRefs(props);
const isEditing = computed(() => !!tag.value);

const color = ref(getRandomItem(predefinedColors));
const selectColor = (selectedColor: string) => {
  color.value = selectedColor;
};

const { r$ } = useRegleSchema('', type('0 < string < 26'));

const resetName = async () => {
  r$.$value = '';
  await nextTick();
  r$.$reset();
};

onMounted(() => {
  if (tag.value) {
    r$.$value = tag.value.name;
    color.value = tag.value.color;
  }
});

const onSubmit = async () => {
  const { data, valid } = await r$.$validate();
  if (!valid) return;

  const payload: SubmitPayloadBody = {
    name: data,
    color: color.value,
  };

  if (isEditing.value) {
    payload.id = tag.value!.id;
  }

  emit('submit', payload);

  if (!isEditing.value) {
    await resetName();
    selectColor(getRandomItem(predefinedColors));
  }
};
</script>

<template>
  <form
    class="join items-start"
    @submit.prevent="onSubmit"
    v-click-outside="() => emit('close')"
  >
    <div class="flex flex-col gap-y-1">
      <input
        v-model="r$.$value"
        type="text"
        placeholder="New tag name"
        class="input input-bordered input-xs join-item"
        :class="{ 'input-error': r$.$error }"
      >
      <ErrorMessage :state="r$"/>
    </div>

    <button
      type="button"
      popovertarget="tag-colorpicker-popover"
      style="anchor-name:--tag-colorpicker-anchor;"
      class="btn btn-xs btn-square join-item border-none text-neutral-content"
      :style="{ backgroundColor: color }"
    >
      <VueIcon name="cg:color-picker" />
    </button>

    <ul
      popover
      id="tag-colorpicker-popover"
      style="position-anchor:--tag-colorpicker-anchor"
      class="dropdown menu p-2 shadow bg-base-100 rounded-box w-max"
    >
      <div class="grid grid-cols-6 gap-1 mb-2">
        <button
          v-for="c in predefinedColors"
          :key="c"
          type="button"
          class="btn btn-xs btn-square border-none rounded-sm"
          :style="{ backgroundColor: c }"
          @click="selectColor(c)"
        />
      </div>

      <input
        v-model="color"
        type="color"
        class="input input-bordered input-sm w-full h-8 p-1 rounded-sm"
      >
    </ul>

    <button
      :disabled="!r$.$correct"
      type="submit"
      class="btn btn-primary btn-xs join-item"
    >
      {{ isEditing ? 'Save' : 'Add' }}
    </button>
  </form>
</template>
