<script lang="ts" setup>
import { ref } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useGetTags } from '../queries/use-get-tags';
import { useDeleteTag } from '../queries/use-delete-tag';
import { useUpdateTag } from '../queries/use-update-tag';
import TagBadge from './tag-badge.vue';
import TagCreationForm, { type SubmitPayloadBody } from './tag-form.vue';

const { data: tags } = useGetTags();
const { mutate: deleteTag } = useDeleteTag();
const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();

const editingId = ref('');
const closeEditing = () => editingId.value = '';

const handleSubmit = async (payload: SubmitPayloadBody) => {
  await updateTag(payload as Required<SubmitPayloadBody>);
  closeEditing();
};
</script>

<template>
  <div class="flex flex-wrap gap-x-2 gap-y-1">
    <template
      v-for="tag in tags"
      :key="tag.id"
    >
      <TagCreationForm
        v-if="editingId === tag.id"
        class="w-52"
        :disabled="isUpdating"
        :tag="tag"
        @submit="handleSubmit"
        @close="closeEditing"
      />

      <TagBadge v-else :tag="tag">
        <template #action>
          <div class="flex gap-2">
            <VueIcon name="lu:pencil-line" @click.stop="() => editingId = tag.id" />
            <VueIcon
              class="cursor-pointer"
              name="lu:trash"
              @click="() => deleteTag(tag.id)"
            />
          </div>
        </template>
      </TagBadge>
    </template>
  </div>
</template>
