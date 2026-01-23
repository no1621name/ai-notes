<script setup lang="ts">
import { computed } from 'vue';
import type { NoteShort } from '../model/types';
import { useDeleteNote } from '../queries/use-delete-note';
import BaseCard from './base-card.vue';
import DeleteNote from './delete-note.vue';
import { useI18n } from 'vue-i18n';

interface DateItem {
  label: string;
  value: string | null;
}

const { mutate: deleteNote, isUpdating } = useDeleteNote();

const props = defineProps<{
  note: NoteShort;
}>();

const { d, t } = useI18n();

const routeParams = computed(() => ({
  name: 'note-details',
  params: { id: props.note.id },
}));

const dateItems = computed<DateItem[]>(() => {
  const { created_at, updated_at, reminder_date } = props.note;
  return [
    { label: t('created'), value: d(created_at, 'short') },
    { label: t('updated'), value: d(updated_at, 'long') },
    { label: t('reminder'), value: reminder_date ? d(reminder_date, 'long') : null },
  ];
});
</script>

<template>
  <BaseCard :to="routeParams" :disabled="isUpdating">
    <DeleteNote
      class="absolute bottom-2 right-2"
      :loading="isUpdating"
      @click="deleteNote(note.id)"
    />

    <h2 class="card-title break-all">
      {{ note.title }}
    </h2>

    <div class="text-ellipsis">
      <p class="text-base-content/70 line-clamp-5">{{ note.description }}</p>
    </div>

    <div class="card-actions mt-auto">
      <div class="grow">
        <div v-if="note.tags && note.tags.length" class="flex flex-wrap gap-2">
          <slot name="tags" :tags="note.tags" />
        </div>
      </div>
    </div>

    <div class="text-xs text-base-content/50 mt-2 flex flex-col gap-0.5">
      <template v-for="item in dateItems" :key="item.label">
        <span v-if="item.value">
          {{ item.label }}: {{ item.value }}
        </span>
      </template>
    </div>
  </BaseCard>
</template>

<i18n>
{
  "en": {
    "created": "Created",
    "updated": "Updated",
    "reminder": "Reminder"
  },
  "ru": {
    "created": "Создано",
    "updated": "Обновлено",
    "reminder": "Напоминание"
  }
}
</i18n>
