<script lang="ts" setup>
import { useGetTags } from '../queries/use-get-tags';
import { useCreateTag } from '../queries/use-create-tag';
import Button from '@/shared/ui/button.vue';
import TagBadge from './tag-badge.vue';
import TagCreationForm from './tag-form.vue';

const { data: tags, isPending } = useGetTags();
const { mutateAsync: createTag } = useCreateTag();

const emit = defineEmits<{
  (e: 'select', payload: { id: string }): void;
}>();

const handleTagCreation = async (payload: Record<'name' | 'color', string>) => {
  const newId = await createTag(payload);
  emit('select', { id: newId });
};
</script>

<template>
  <div>
    <Button
      style="anchor-name:--anchor-tags-dropdown"
      popovertarget="tags-dropdown"
    >
      Add tag
    </Button>

    <div
      popover
      id="tags-dropdown"
      style="position-anchor:--anchor-tags-dropdown"
      class="dropdown overflow-hidden mt-1 p-2 gap-y-2 items-stretch flex flex-col rounded-box bg-base-200 shadow-sm w-52"
      v-if="!isPending"
    >
      <TransitionGroup
        v-if="tags?.length"
        name="list"
        tag="div"
        class="flex flex-wrap gap-1 max-h-32 overflow-y-auto"
      >
        <TagBadge
          v-for="tag in tags"
          :key="tag.id"
          :tag="tag"
          class="cursor-pointer"
          @click="() => emit('select', { id: tag.id })"
        />
      </TransitionGroup>
      <TagCreationForm @submit="handleTagCreation"/>
    </div>
  </div>
</template>
