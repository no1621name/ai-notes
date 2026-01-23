<script lang="ts" setup>
import { watch, toRefs } from 'vue';
import { useRegleSchema } from '@regle/schemas';
import { type } from 'arktype';
import { useI18n } from 'vue-i18n';

import type { SavedPrompt, SavedPromptPayload } from '../../model/types';
import ErrorMessage from '@/shared/ui/error-message.vue';
import Fieldset from '@/shared/ui/fieldset.vue';

const props = withDefaults(
  defineProps<{
    prompt?: SavedPrompt;
    disabled?: boolean;
  }>(), {
    disabled: false,
  });
const { prompt } = toRefs(props);

const emit = defineEmits<{
  (e: 'submit', payload: SavedPromptPayload): void;
  (e: 'close'): void;
}>();

const { t } = useI18n();

const schema = type({
  name: '0 < string < 200',
  prompt: 'string > 0',
});

const getInitialState = (prompt?: SavedPrompt) => ({
  name: prompt?.name ?? '',
  prompt: prompt?.prompt ?? '',
});

const { r$ } = useRegleSchema({}, schema);

watch(prompt, (newData) => {
  r$.$value = getInitialState(newData);
  r$.$reset();
}, {
  immediate: true,
});

const onSubmit = async () => {
  const { data, valid } = await r$.$validate();
  if (!valid) return;

  emit('submit', data);
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <Fieldset :disabled="disabled" class="bg-base-300">
      <input
        v-model.trim="r$.$value.name"
        type="text"
        :placeholder="t('namePlaceholder')"
        class="input input-bordered input-xs w-full"
        :class="{ 'input-error': r$.name.$error }"
      >
      <ErrorMessage class="text-xs" :state="r$.name"/>

      <textarea
        v-model="r$.$value.prompt"
        :placeholder="t('promptPlaceholder')"
        class="textarea h-24 resize-none textarea-xs w-full"
        :class="{ 'textarea-error': r$.prompt.$error }"
      />

      <ErrorMessage class="text-xs" :state="r$.prompt"/>

      <div class="flex gap-1">
        <button
          type="submit"
          class="btn btn-sm w-max flex-1"
          :disabled="!r$.$anyDirty || r$.$invalid"
        >
          {{ t('actions.save') }}
        </button>
        <button
          type="button"
          @click="emit('close')"
          class="btn btn-sm w-max flex-1 btn-ghost"
        >
          {{ t('actions.cancel') }}
        </button>
      </div>
    </Fieldset>
  </form>
</template>

<i18n>
{
  "en": {
    "namePlaceholder": "Name",
    "promptPlaceholder": "Prompt"
  },
  "ru": {
    "namePlaceholder": "Название",
    "promptPlaceholder": "Промпт"
  }
}
</i18n>
