import { useMutation, type DefaultError } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { deleteTag } from '../api/delete-tag';
import { useInvalidateTags } from './invalidate';

export const useDeleteTag = () => {
  const { onSettled } = useInvalidateTags();
  const dataTransfer = useDbDataTransfer();

  return useMutation<void, DefaultError, string>({
    mutationKey: ['tags', 'delete'],
    mutationFn: id => deleteTag(dataTransfer, id),
    onSettled,
  });
};
