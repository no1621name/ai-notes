<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { useI18n } from 'vue-i18n';

import type { SavedPrompt, SavedPromptPayload } from '../../model/types';
import { useUpdateSavedPrompt } from '../../queries/saved-prompts/use-update-saved-prompt';
import { useGetSavedPrompts } from '../../queries/saved-prompts/use-get-saved-prompts';
import { useCreateSavedPrompt } from '../../queries/saved-prompts/use-create-saved-prompt';
import { useDeleteSavedPrompt } from '../../queries/saved-prompts/use-delete-saved-prompt';
import Badge from './badge.vue';
import Form from './form.vue';
import ConfirmForm from '@/shared/ui/confirm-form.vue';
import SkeletonRow from '@/shared/ui/skeleton-row.vue';

const { t } = useI18n();

const { data: prompts, isLoading } = useGetSavedPrompts();

const editingId = ref<SavedPrompt['id'] | 'new' | null>(null);
const deletingId = ref<SavedPrompt['id'] | null>(null);
const { mutate: updatePrompt } = useUpdateSavedPrompt(editingId);
const { mutate: createPrompt, isSuccess: isCreated } = useCreateSavedPrompt();
const { mutate: deletePrompt } = useDeleteSavedPrompt();

const editingElement = computed(() => prompts.value?.find(p => p.id === editingId.value));
const isCreatingForm = computed(() => editingId.value === 'new');

const handleSubmit = (payload: SavedPromptPayload) => {
  if (!editingId.value) {
    return;
  }

  if (isCreatingForm.value) {
    createPrompt(payload);
  } else {
    updatePrompt(payload);
  }
};

watch(isCreated, (newValue) => {
  if (newValue) {
    editingId.value = null;
  }
});

const toggleCreatingForm = () => {
  editingId.value = isCreatingForm.value ? null : 'new';
};
</script>

<template>
  <SkeletonRow
    v-if="isLoading"
    :width="100"
    :height="24"
  />
  <template v-else>
    <fieldset class="fieldset flex flex-col gap-2 bg-base-200 p-2 rounded-box">
      <legend class="fieldset-legend">
        {{ t('savedPrompts') }}
      </legend>

      <div class="flex flex-wrap gap-2 items-center">
        <button class="btn btn-sm btn-circle" @click="toggleCreatingForm">
          <VueIcon name="lu:x" v-if="isCreatingForm"/>
          <VueIcon name="lu:plus" v-else/>
        </button>

        <template v-for="prompt in prompts" :key="prompt.id">
          <ConfirmForm
            v-if="deletingId === prompt.id"
            mode="error"
            @submit="deletePrompt(prompt.id)"
            @close="deletingId = null"
          >
            <template #message>
              {{ t('deleteConfirm') }}
            </template>
            <template #submit-text>
              {{ t('actions.delete')}}
            </template>
          </ConfirmForm>
          <Badge
            v-else
            :selected="editingId === prompt.id"
            :prompt="prompt"
            :show-actions="true"
            @edit="editingId = prompt.id"
            @delete="deletingId = prompt.id"
          />
        </template>

        <span v-if="!prompts?.length" class="text-base-content/50 italic">
          {{ t('emptyList') }}
        </span>
      </div>
      <div v-if="editingId">
        <Form
          :prompt="editingId === 'new' ? undefined : editingElement"
          @submit="handleSubmit"
          @close="editingId = null"
        />
      </div>
    </fieldset>
  </template>
</template>

<i18n>
{
  "en": {
    "deleteConfirm": "Delete this prompt?",
    "emptyList": "No saved prompts..."
  },
  "ru": {
    "deleteConfirm": "Удалить этот промпт?",
    "emptyList": "Нет сохранённых промптов..."
  }
}
</i18n>
