<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { TagBadge } from '@/entities/tag';
import { CreateNoteLink, NoteCard, useGetNotes } from '@/entities/note';
import { useIntersectionObserver } from '@/shared/composables/use-intersection-observer';

const loader = ref<HTMLElement | null>(null);

const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useGetNotes();
const notes = computed(() => data.value?.pages.flat() ?? []);

const { isIntersecting } = useIntersectionObserver(loader);

watchEffect(() => {
  if (isIntersecting.value && hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage();
  }
});
</script>

<template>
  <div class="relative grid grid-cols-3 auto-rows-fr gap-3 m-3">
    <CreateNoteLink/>
    <NoteCard
      v-for="note in notes"
      :key="note.id"
      :note="note"
    >
      <template #tags="{ tags }">
        <TagBadge
          v-for="tag in tags"
          :key="tag.id"
          :tag="tag"
        />
      </template>
    </NoteCard>

    <template v-if="isLoading">
      <div
        v-for="i in 5"
        :key="i"
        class="skeleton w-full h-full min-h-36"
      />
    </template>

    <div ref="loader" class="absolute bottom-0 w-full h-4"/>
  </div>
</template>
