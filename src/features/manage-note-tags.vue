<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { type Tag, TagBadge, TagsDropdown } from '@/entities/tag';
import { useAddTagToNote, useRemoveTagFromNote } from '@/entities/note';

const props = withDefaults(defineProps<{
  noteId: string;
  tags?: Tag[];
  isLoading?: boolean;
}>(), {
  isLoading: false,
});

const { mutate: addTag } = useAddTagToNote();
const { mutate: removeTag } = useRemoveTagFromNote();

const hanldeTagSelection = ({ id }: { id: string }) => {
  addTag({
    noteId: props.noteId,
    tagId: id,
  });
};
</script>

<template>
  <div class="flex items-center flex-wrap gap-x-2 gap-y-1">
    <template v-if="tags?.length" >
      <TagBadge
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
      >
        <template #action>
          <VueIcon
            @click="() => removeTag({
              noteId,
              tagId: tag.id
            })"
            class="cursor-pointer"
            name="lu:x"
          />
        </template>
      </TagBadge>
    </template>

    <template v-if="isLoading">
      <div
        v-for="i in 2"
        :key="i"
        class="skeleton h-5 w-24"
      />
    </template>
    <TagsDropdown
      v-else
      @tag-select="hanldeTagSelection"
      :small-button="!!tags?.length"
      :selected-tags="tags?.map(({id}) => id)"
    />
  </div>
</template>
