<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { NoteTitleField, useCreateNote } from '@/entities/note';
import { FormattingActionsPreview, EditorPreview } from '@/entities/md-editor';
import DrawerLayout from '@/shared/ui/drawer/content-layout.vue';
import { useToasterStore } from '@/app/stores/toaster';
import { debounce } from '@/shared/lib/debounce';

const router = useRouter();
const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
const { add: addToast } = useToasterStore();

const noteTitle = ref('');
const titleFieldRef = ref<InstanceType<typeof NoteTitleField> | null>(null);

onMounted(() => {
  titleFieldRef.value?.focus();
});

const triggerCreate = debounce(async () => {
  if (!noteTitle.value.trim()) return;

  try {
    const data = await createNote(noteTitle.value);
    router.replace({ name: 'note-details', params: { id: data.id } });
  } catch (error) {
    console.error(error);
    addToast({
      title: 'Failed to create note',
      type: 'danger',
    });
  }
}, 1000);
</script>

<template>
  <DrawerLayout tootlip="Enter a title before using">
    <template #header>
      <NoteTitleField
        ref="titleFieldRef"
        @update:model-value="triggerCreate"
        v-model="noteTitle"
        :disabled="isCreating"
      />
    </template>
    <template #toolbar>
      <div class="flex items-end gap-2 flex-wrap">
        <FormattingActionsPreview />
      </div>
    </template>
    <template #default>
      <div class="h-full">
        <EditorPreview />
      </div>
    </template>
  </DrawerLayout>
</template>
