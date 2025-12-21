import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { useMutation, type DefaultError } from '@tanstack/vue-query';
import type { TagBody } from '../api/contracts';
import { updateTag } from '../api/update-tag';
import { useInvalidateTags } from './invalidate';

export interface UpdateBody extends Omit<Partial<TagBody>, 'created_at'> {
  id: TagBody['id'];
}

export const useUpdateTag = () => {
  const { onSettled } = useInvalidateTags();
  const dataTransfer = useDbDataTransfer();

  return useMutation<TagBody, DefaultError, UpdateBody>({
    mutationFn: body => updateTag(dataTransfer, body.id, body),
    onSettled,
  });
};
