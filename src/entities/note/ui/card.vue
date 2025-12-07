<script setup lang="ts">
import { computed } from 'vue';
import type { NoteShort } from '../model/types';
import { formatDate, DateFormat } from '@/shared/lib/date';

interface DateItem {
  label: string;
  value: string | null;
}

const props = defineProps<{
  note: NoteShort;
}>();

const routeParams = computed(() => ({
  name: 'note-details',
  params: { id: props.note.id },
}));

const dateItems = computed<DateItem[]>(() => {
  const { created_at, updated_at, reminder_date } = props.note;
  return [
    { label: 'Created', value: formatDate(created_at) },
    { label: 'Updated', value: formatDate(updated_at, DateFormat.WITH_TIME) },
    { label: 'Reminder', value: formatDate(reminder_date, DateFormat.WITH_TIME) },
  ];
});
</script>

<template>
  <RouterLink :to="routeParams" class="card bg-base-200 shadow-xl h-full">
    <div class="card-body">
      <h2 class="card-title break-all">{{ note.title }}</h2>

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
    </div>
  </RouterLink>
</template>
