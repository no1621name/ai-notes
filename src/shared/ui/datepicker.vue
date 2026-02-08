<script lang="ts" setup>
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import '@vuepic/vue-datepicker/dist/main.css';

import { useTheme } from '../composables/use-theme';

const dpRef = useTemplateRef<InstanceType<typeof VueDatePicker>>('datepicker');

const { t } = useI18n();

const props = defineProps<{
  modelValue: Date | null;
  minDate?: Date;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', payload: Date | null): void;
}>();

const currentTheme = useTheme();
</script>

<template>
  <VueDatePicker
    ref="dpRef"
    vertical
    :min-date="minDate"
    :dark="currentTheme === 'dark'"
    :modelValue="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #action-buttons="{ selectDate, selectionDisabled }">
      <button
        class="btn btn-primary btn-soft btn-sm px-6"
        @click="selectDate"
        :disabled="selectionDisabled"
      >
        {{ t('actions.save') }}
      </button>
    </template>
  </VueDatePicker>
</template>

<style>
@media (width < 40rem) {
  :root {
    --dp-button-height: 32px;
    --dp-month-year-row-height: 32px;
    --dp-month-year-row-button-size: 32px;
    --dp-cell-size: 28px;
    --dp-cell-padding: 4px;
    --dp-common-padding: 8px;
    --dp-input-icon-padding: 28px;
    --dp-input-padding: 4px;
    --dp-menu-min-width: 100px;
    --dp-row-margin: 4px 0;
    --dp-calendar-header-cell-padding: 0.35rem;
    --dp-two-calendars-spacing: 6px;
    --dp-overlay-col-padding: 2px;
    --dp-time-inc-dec-button-size: 28px;
    --dp-menu-padding: 5px 6px;
  }
}

.dp__theme_dark, .dp__theme_light {
  --dp-background-color: var(--color-base-300);
  --dp-text-color: var(--color-base-content);
  --dp-primary-color: var(--color-primary);
  --dp-danger-color: var(--color-error);
  --dp-marker-color: var(--color-error);
  --dp-success-color: var(--color-success);
  --dp-success-color-disabled: var(--color-success-content);
}
</style>
