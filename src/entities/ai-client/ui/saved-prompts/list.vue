<script lang="ts" setup>
import SkeletonRow from '@/shared/ui/skeleton-row.vue';
import { useGetSavedPrompts } from '../../queries/saved-prompts/use-get-saved-prompts';
import Badge from './badge.vue';
import type { SavedPrompt, SavedPromptPayload } from '../../model/types';
import { computed, ref, watch } from 'vue';
import { useUpdateSavedPrompt } from '../../queries/saved-prompts/use-update-saved-prompt';
import Form from './form.vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { useCreateSavedPrompt } from '../../queries/saved-prompts/use-create-saved-prompt';
import { useDeleteSavedPrompt } from '../../queries/saved-prompts/use-delete-saved-prompt';
import ConfirmForm from '@/shared/ui/confirm-form.vue';

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
      <legend class="fieldset-legend">Saved prompts</legend>

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
              Delete this prompt?
            </template>
            <template #submit-text>
              Delete
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
          No saved prompts...
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
