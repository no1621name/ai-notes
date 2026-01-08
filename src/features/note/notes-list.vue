<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { TagBadge, TagsSelectingList, TagsList, type Tag } from '@/entities/tag';
import { CreateNoteLink, NoteBaseCard, NoteCard, NoteSearchInput, useGetNotes } from '@/entities/note';
import { useIntersectionObserver } from '@/shared/composables/use-intersection-observer';

const loader = ref<HTMLElement | null>(null);

const editTags = ref(false);
const search = ref('');
const selectedTags = ref<Tag['id'][]>([]);
const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useGetNotes({
  search,
  tags: selectedTags,
});
const notes = computed(() => data.value?.pages.flat() ?? []);

const { isIntersecting } = useIntersectionObserver(loader);

watchEffect(() => {
  if (isIntersecting.value && hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage();
  }
});

const updateSearch = (value: string) => {
  search.value = value;
};

const updateSelectedTags = (value: Tag['id']) => {
  if (selectedTags.value.includes(value)) {
    selectedTags.value = selectedTags.value.filter(tag => tag !== value);
  } else {
    selectedTags.value.push(value);
  }
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <NoteSearchInput @update:search="updateSearch"/>

    <div class="flex flex-col gap-3">
      <button class="btn w-max btn-sm" @click="editTags = !editTags">
        {{ editTags ? 'Close editing' : 'Edit tags' }}
      </button>

      <TagsList v-if="editTags"/>
      <TagsSelectingList
        v-else
        :selectedTags="selectedTags"
        @tag-select="updateSelectedTags"
      />
    </div>

    <div class="relative grid grid-cols-3 auto-rows-fr gap-3">
      <CreateNoteLink/>

      <template v-if="notes.length === 0 && search && !isLoading">
        <NoteBaseCard>
          <div class="m-auto">
            <p class="text-lg my-10 text-center break-word">
              there is no results for "{{ search }}"
            </p>
          </div>
        </NoteBaseCard>
      </template>
      <template v-else>
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
      </template>

      <template v-if="isLoading">
        <div
          v-for="i in 5"
          :key="i"
          class="skeleton w-full h-full min-h-36"
        />
      </template>

      <div ref="loader" class="absolute bottom-0 w-full h-4"/>
    </div>
  </div>
</template>
