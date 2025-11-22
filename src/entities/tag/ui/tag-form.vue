<script setup lang="ts">
import { ref, toRefs, onMounted, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import zod from 'zod';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import Button from '@/shared/ui/button.vue';
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

const { handleSubmit, defineField, errors, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      name: zod.string().min(1, 'Name is required').max(25, 'Name is too long').nullish(),
    }),
  ),
});

onMounted(() => {
  if (tag.value) {
    setValues({ name: tag.value.name });
    color.value = tag.value.color;
  } else {
    resetForm();
    color.value = getRandomItem(predefinedColors);
  }
});

const [name, nameAttrs] = defineField('name');

const onSubmit = handleSubmit((values) => {
  const payload: SubmitPayloadBody = {
    name: values.name!,
    color: color.value,
  };

  if (isEditing.value) {
    payload.id = tag.value!.id;
  }

  emit('submit', payload);

  if (!isEditing.value) {
    resetForm();
    selectColor(getRandomItem(predefinedColors));
  }
});
</script>

<template>
  <form
    class="join items-start"
    @submit.prevent="onSubmit"
    v-click-outside="() => emit('close')"
  >
    <div class="flex flex-col gap-y-1">
      <input
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        placeholder="New tag name"
        class="input input-bordered input-xs join-item"
        :class="{ 'input-error': !!errors.name }"
      >
      <span v-if="errors.name" class="text-error text-xs">{{ errors.name }}</span>
    </div>

    <Button
      type="button"
      popovertarget="tag-colorpicker-popover"
      style="anchor-name:--tag-colorpicker-anchor;"
      class="btn-xs btn-square join-item border-none text-neutral-content"
      :style="{ backgroundColor: color }"
    >
      <VueIcon name="cg:color-picker" />
    </Button>

    <ul
      popover
      id="tag-colorpicker-popover"
      style="position-anchor:--tag-colorpicker-anchor"
      class="dropdown menu p-2 shadow bg-base-100 rounded-box w-max"
    >
      <div class="grid grid-cols-6 gap-1 mb-2">
        <Button
          v-for="c in predefinedColors"
          :key="c"
          type="button"
          class="btn-xs btn-square border-none rounded-sm"
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

    <Button
      :disabled="!name"
      type="submit"
      class="btn-primary btn-xs join-item"
    >
      {{ isEditing ? 'Save' : 'Add' }}
    </Button>
  </form>
</template>
