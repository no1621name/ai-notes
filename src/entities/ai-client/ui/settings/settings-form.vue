<script lang="ts" setup>
import { ref, watch, reactive, computed } from 'vue';
import { useRegleSchema } from '@regle/schemas';
import { type } from 'arktype';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import type { RegleExternalErrorTree } from '@regle/core';
import { useI18n } from 'vue-i18n';

import type { AiSettings } from '../../model/types';
import { useAiClient } from '../../composables/use-ai-client';
import { useUpdateSettings } from '../../queries/use-update-settings';
import ModelSelect from '../model/model-select.vue';
import ErrorMessage from '@/shared/ui/error-message.vue';
import PasswordInput from '@/shared/ui/password-input.vue';

const { t } = useI18n();

const { settings, client, isLoadingSettings, settingsHasValidApiKey } = useAiClient();
const { mutate: updateSettings, isPending: isUpdating, error: updateError } = useUpdateSettings();

const schema = type({
  apiKey: type(client.apiKeyRegex).configure({
    message: 'Invalid API key',
  }).optional(),
  model: type('string').optional(),
  temperature: '0<=number<=2',
});

const state = reactive<AiSettings>({
  apiKey: '',
  model: '',
  temperature: 1,
});

const prevSettings = ref<AiSettings | null>(null);
const completePrevSettings = computed(() => !!prevSettings.value?.model);
const externalErrors = ref<RegleExternalErrorTree<typeof state>>({});

const { r$ } = useRegleSchema(state, schema, {
  externalErrors,
  clearExternalErrorsOnChange: false,
});

watch(r$.$value, () => {
  r$.$clearExternalErrors();
  if (r$.apiKey?.$edited && r$.apiKey.$correct) {
    updateSettings({ apiKey: r$.apiKey.$value });
  }
});

watch(settings, () => {
  if (settings.value) {
    state.apiKey = settings.value.apiKey;
    state.model = settings.value.model;
    state.temperature = settings.value.temperature;

    prevSettings.value = settings.value;
    r$.$reset();
  }
});

const onSubmit = async () => {
  const { valid, data } = await r$.$validate();

  if (valid) {
    updateSettings(data, {
      onSuccess: () => {
        prevSettings.value = data;
        r$.$reset();
      },
    });
  }
};

const undoChanges = () => {
  if (completePrevSettings.value) {
    r$.$reset({
      toState: prevSettings.value!,
    });
  }
};

watch(updateError, (newError) => {
  if (newError) {
    externalErrors.value = {
      temperature: [newError.message],
    };
  }
});
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <fieldset class="fieldset bg-base-200 border border-base-300 rounded-box p-4 relative" :disabled="isUpdating">
        <legend class="fieldset-legend">
          {{ t('settingsName') }}
        </legend>

        <button
          :disabled="!r$.$anyEdited || !completePrevSettings"
          type="button"
          class="btn btn-sm btn-square text-sm absolute top-2 right-2"
          :title="t('resetSettings')"
          :aria-label="t('resetSettings')"
          @click="undoChanges"
        >
          <VueIcon name="lu:undo-2"/>
        </button>

        <label class="label">
          {{ t('apiKey') }}
        </label>
        <PasswordInput
          v-model="r$.$value.apiKey"
          :disabled="isLoadingSettings"
        />
        <ErrorMessage :state="r$.apiKey"/>

        <label class="label">
          {{ t('model') }}
        </label>
        <ModelSelect v-model="r$.$value.model"/>
        <ErrorMessage
          :state="r$.model"
          :message="!settingsHasValidApiKey ? t('apiKeyError') : undefined"
        />

        <label class="label">
          {{ t('temperature') }}
        </label>

        <div class="flex items-start gap-2">
          <div class="w-full max-w-xs">
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              class="range range-sm"
              v-model.number="r$.$value.temperature"
            >
            <div class="flex justify-between px-2.5 mt-1 text-[8px] font-mono">
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div class="flex justify-between px-2.5 text-xs font-mono">
              <span>0</span>
              <span>1</span>
              <span>2</span>
            </div>
          </div>

          <span class="text-sm">{{ r$.$value.temperature }}</span>
        </div>
        <ErrorMessage :state="r$.temperature"/>

        <button
          type="submit"
          class="btn mt-2"
          :disabled="!r$.$anyEdited || r$.$invalid"
          :class="{
            'btn-primary': r$.$anyEdited,
          }"
        >
          {{ t('actions.save') }}
        </button>
      </fieldset>
    </form>
  </div>
</template>

<i18n>
{
  "en": {
    "settingsName": "AI features settings",
    "apiKey": "API key",
    "model": "Default model",
    "temperature": "Temperature",
    "resetSettings": "Reset settings",
    "apiKeyError": "Enter api key to get models",
  },
  "ru": {
    "settingsName": "Настройки AI функций",
    "apiKey": "API ключ",
    "model": "Модель по умолчанию",
    "temperature": "Температура",
    "resetSettings": "Reset settings",
    "apiKeyError": "Введите API ключ, чтобы получить модели",
  }
}
</i18n>
