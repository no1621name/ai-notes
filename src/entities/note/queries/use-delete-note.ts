import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { PrimaryKeyType } from '@/shared/types/api';
import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';
import { deleteNote } from '../api/delete-note';
import { computed, ref } from 'vue';

export const useDeleteNote = () => {
  const dataTransfer = useDbDataTransfer();
  const queryClient = useQueryClient();
  const updatingList = ref(false);

  const query = useMutation<void, DefaultError, PrimaryKeyType>({
    mutationFn: id => deleteNote(dataTransfer, id),
    onSuccess: async () => {
      updatingList.value = true;
      await queryClient.invalidateQueries({ queryKey: ['notes'] }).finally(() => {
        updatingList.value = false;
      });
    },
  });

  const isUpdating = computed(() => updatingList.value || query.isPending.value);

  return {
    ...query,
    isUpdating,
  };
};
