<script setup lang="ts">
import { ref, toRefs, onMounted, computed, nextTick } from 'vue';
import { useRegleSchema } from '@regle/schemas';
import { type } from 'arktype';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import type { Tag } from '../model/types';
import { predefinedColors } from '../model/constants';
import { getRandomItem } from '@/shared/lib/get-random-item';
import Dropdown from '@/shared/ui/dropdown-menu/dropdown.vue';
import ErrorMessage from '@/shared/ui/error-message.vue';

export interface SubmitPayloadBody {
  id?: Tag['id'];
  name: string;
  color: string;
}

const props = withDefaults(defineProps<{
  tag?: Tag;
  autoclose?: boolean;
}>(), {
  autoclose: true,
});

const emit = defineEmits<{
  (e: 'submit', payload: { id?: Tag['id']; name: string; color: string }): void;
  (e: 'close'): void;
}>();

const { tag } = toRefs(props);
const isEditing = computed(() => !!tag.value);

const { t } = useI18n();

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

const clickOutside = () => {
  if (props.autoclose) {
    emit('close');
  }
};
</script>

<template>
  <form
    class="join items-end"
    @submit.prevent="onSubmit"
    v-click-outside="clickOutside"
  >
    <div class="flex flex-col gap-y-1">
      <input
        v-model="r$.$value"
        type="text"
        :placeholder="t('placeholder')"
        class="input input-bordered input-xs join-item"
        :class="{ 'input-error': r$.$error }"
      >
      <ErrorMessage :state="r$"/>
    </div>

    <Dropdown :allowed-placements="['bottom-end']">
      <template #trigger="{ toggle }">
        <button
          type="button"
          class="btn btn-xs btn-square border-none text-neutral-content"
          :style="{ backgroundColor: color }"
          @click="toggle"
        >
          <VueIcon name="cg:color-picker" />
        </button>
      </template>

      <ul class="menu p-2 w-max">
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
    </Dropdown>

    <button
      :disabled="!r$.$correct"
      type="submit"
      class="btn btn-primary btn-xs join-item"
    >
      {{ isEditing ? t('actions.save') : t('actions.add') }}
    </button>

    <button
      v-if="!autoclose"
      type="button"
      class="btn btn-xs join-item"
      :aria-label="t('actions.close')"
      :title="t('actions.close')"
      @click="emit('close')"
    >
      <VueIcon name="lu:x"/>
    </button>
  </form>
</template>

<i18n>
{
  "en": {
    "placeholder": "New tag name"
  },
  "ru": {
    "placeholder": "Новая метка"
  }
}
</i18n>
