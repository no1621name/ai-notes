<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useGetTags } from '../queries/use-get-tags';
import { useCreateTag } from '../queries/use-create-tag';
import Button from '@/shared/ui/button.vue';
import TagBadge from './tag-badge.vue';
import TagCreationForm from './tag-form.vue';

withDefaults(defineProps<{
  smallButton?: boolean;
  selectedTags?: string[];
}>(), {
  smallButton: false,
  selectedTags: () => [],
});

const { data: tags, isPending } = useGetTags();
const { mutateAsync: createTag } = useCreateTag();

const emit = defineEmits<{
  (e: 'tag-select', payload: { id: string }): void;
}>();

const handleTagCreation = async (payload: Record<'name' | 'color', string>) => {
  await createTag(payload);
};
</script>

<template>
  <div>
    <Button
      style="anchor-name:--anchor-tags-dropdown"
      popovertarget="tags-dropdown"
      class="btn-sm"
      :class="{'btn-circle': smallButton}"
    >
      <VueIcon name="lu:plus" v-if="smallButton"/>
      <template v-else>
        Add tag
      </template>
    </Button>

    <div
      popover
      id="tags-dropdown"
      style="position-anchor:--anchor-tags-dropdown"
      class="dropdown dropdown-end overflow-hidden mt-1 p-2 rounded-box bg-base-200 shadow-sm w-52"
      v-if="!isPending"
    >
      <div class="flex flex-col gap-y-2 items-stretch">
        <div
          v-if="tags?.length"
          class="flex flex-wrap gap-1 max-h-32 overflow-y-auto overflow-x-hidden"
        >
          <p v-if="tags.length === selectedTags.length" class="text-base-content/75 text-xs">You've added all possible tags!</p>
          <TransitionGroup v-else name="list">
            <template
              v-for="tag in tags"
              :key="tag.id"
            >
              <TagBadge
                v-if="!selectedTags.includes(tag.id)"
                :tag="tag"
                class="cursor-pointer"
                @click="() => emit('tag-select', { id: tag.id})"
              />
            </template>
          </TransitionGroup>
        </div>
        <TagCreationForm @submit="handleTagCreation"/>
      </div>
    </div>
  </div>
</template>
