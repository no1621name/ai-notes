<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

const { mutate: addTag } = useAddTagToNote();
const { mutate: removeTag } = useRemoveTagFromNote();

const handleTagSelection = ({ id }: { id: string }) => {
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
          <button
            :title="t('actions.delete')"
            :aria-label="t('actions.delete')"
            @click="() => removeTag({
              noteId,
              tagId: tag.id
            })"
          >
            <VueIcon
              class="cursor-pointer"
              name="lu:x"
            />
          </button>
        </template>
      </TagBadge>
    </template>

    <template v-if="isLoading && !tags?.length">
      <div
        v-for="i in 2"
        :key="i"
        class="skeleton h-5 w-24"
      />
    </template>
    <TagsDropdown
      v-else
      @tag-select="handleTagSelection"
      :small-button="!!tags?.length"
      :selected-tags="tags?.map(({id}) => id)"
    />
  </div>
</template>
