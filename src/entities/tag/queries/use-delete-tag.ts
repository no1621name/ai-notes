import { useMutation, type DefaultError } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { PrimaryKeyType } from '@/shared/types/api';
import { deleteTag } from '../api/delete-tag';
import { useInvalidateTags } from './invalidate';

export const useDeleteTag = () => {
  const { onSettled } = useInvalidateTags();
  const dataTransfer = useDbDataTransfer();

  return useMutation<void, DefaultError, PrimaryKeyType>({
    mutationFn: id => deleteTag(dataTransfer, id),
    onSettled,
  });
};
