<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useGetTags } from '../queries/use-get-tags';
import { useDeleteTag } from '../queries/use-delete-tag';
import { useUpdateTag } from '../queries/use-update-tag';
import TagBadge from './tag-badge.vue';
import TagCreationForm, { type SubmitPayloadBody } from './tag-form.vue';
import ConfirmForm from '@/shared/ui/confirm-form.vue';

const { data: tags } = useGetTags();
const { mutate: deleteTag } = useDeleteTag();
const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();

const editingId = ref('');
const deletingId = ref<string | null>(null);

const closeEditing = () => editingId.value = '';

const handleSubmit = async (payload: SubmitPayloadBody) => {
  await updateTag(payload as Required<SubmitPayloadBody>);
  closeEditing();
};

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap gap-x-2 gap-y-1 items-center">
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

      <ConfirmForm
        v-else-if="deletingId === tag.id"
        mode="error"
        @submit="deleteTag(tag.id)"
        @close="deletingId = null"
      >
        <template #message>
          {{ t('deleteConfirm') }}
        </template>
        <template #submit-text>
          {{ t('actions.delete') }}
        </template>
      </ConfirmForm>

      <TagBadge v-else :tag="tag">
        <template #action>
          <div class="flex gap-2">
            <VueIcon
              class="cursor-pointer "
              name="lu:pencil-line"
              @click.stop="() => editingId = tag.id"
            />
            <VueIcon
              class="cursor-pointer"
              name="lu:trash"
              @click="deletingId = tag.id"
            />
          </div>
        </template>
      </TagBadge>
    </template>
  </div>
</template>

<i18n>
{
  "en": {
    "deleteConfirm": "Delete this tag?"
  },
  "ru": {
    "deleteConfirm": "Удалить этот тег?"
  }
}
</i18n>
