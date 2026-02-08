<script lang="ts" setup>
import { ref, watch, toRef, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import Datepicker from '@/shared/ui/datepicker.vue';
import { useUpdateReminder } from '@/entities/note';
import { formatForDatetimeLocal } from '@/shared/lib/date';

const props = defineProps<{
  noteId: string;
  date?: string | Date | null;
  noteTitle?: string;
}>();

const { t } = useI18n();
const noteId = toRef(props.noteId);
const { updateReminder, isLoading: isReminderUpdating } = useUpdateReminder(noteId);

const getCurrentDate = () => new Date(Date.now() - 60 * 1000);

const selectedDate = ref<Date | null>(props.date ? new Date(props.date) : null);
const minDate = ref(getCurrentDate());
let intervalId: ReturnType<typeof setInterval>;
let timeoutId: ReturnType<typeof setTimeout>;

const updateMinDate = () => {
  minDate.value = getCurrentDate();
};

onMounted(() => {
  const msToNextMinute = 60000 - (Date.now() % 60000);

  timeoutId = setTimeout(() => {
    updateMinDate();
    intervalId = setInterval(updateMinDate, 60000);
  }, msToNextMinute);
});

onUnmounted(() => {
  clearTimeout(timeoutId);
  clearInterval(intervalId);
});

watch(() => props.date, (newDate) => {
  if (newDate) {
    const d = new Date(newDate);
    if (!selectedDate.value || selectedDate.value.getTime() !== d.getTime()) {
      selectedDate.value = d;
    }
  } else {
    selectedDate.value = null;
  }
});

watch(selectedDate, (newDate) => {
  if (!newDate) {
    if (props.date) {
      updateReminder('', props.noteTitle || t('defaultNoteTitle'));
    }
    return;
  }

  const currentPropsDateStr = props.date ? formatForDatetimeLocal(props.date) : '';
  const newDateStr = formatForDatetimeLocal(newDate);

  if (currentPropsDateStr === newDateStr) {
    return;
  }

  updateReminder(newDateStr, props.noteTitle || t('defaultNoteTitle'));
});
</script>

<template>
  <fieldset class="fieldset" :disabled="isReminderUpdating">
    <label class="label flex sm:flex-col w-max items-center sm:items-start">
      <p class="inline-flex items-center gap-1">
        {{ t('reminderDate') }}
        <span class="tooltip tooltip-right">
          <VueIcon name="lu:info"/>
          <span class="tooltip-content text-xs">{{ t('reminderTooltip') }}</span>
        </span>
      </p>
      <Datepicker
        v-model="selectedDate"
        :min-date="minDate"
      />
    </label>
  </fieldset>
</template>

<i18n>
{
  "en": {
    "reminderDate": "Reminder date",
    "reminderTooltip": "We will send you a notification",
    "defaultNoteTitle": "Reminder"
  },
  "ru": {
    "reminderDate": "Дата напоминания",
    "reminderTooltip": "Мы отправим вам уведомление",
    "defaultNoteTitle": "Напоминание"
  }
}
</i18n>
