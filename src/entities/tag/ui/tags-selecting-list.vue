<script lang="ts" setup>
import type { Tag } from '../model/types';
import TagBadge from './tag-badge.vue';
import { useGetTags } from '../queries/use-get-tags';

withDefaults(defineProps<{
  selectedTags?: Tag['id'][];
  isFetching?: boolean;
}>(), {
  selectedTags: () => [],
});

defineEmits<{
  (e: 'tag-select', id: Tag['id']): void;
}>();

const { data, isLoading } = useGetTags();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <template v-if="isLoading">
      <div
        v-for="i in 5"
        :key="i"
        class="badge skeleton w-14"
      />
    </template>
    <template v-else>
      <TagBadge
        v-for="tag in data"
        :key="tag.id"
        :tag="tag"
        :outline="!selectedTags.includes(tag.id)"
        :class="{'cursor-pointer': !isFetching, 'pointer-events-none': isFetching}"
        @click="$emit('tag-select', tag.id)"
      />
    </template>
  </div>
</template>
