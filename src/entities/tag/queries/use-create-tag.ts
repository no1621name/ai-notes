import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';
import type { TagBody } from '../api/contracts';
import { createTag } from '../api/create-tag';

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  const dataTransfer = useDbDataTransfer();

  return useMutation<string, DefaultError, Omit<TagBody, 'id' | 'created_at'>>({
    mutationFn: body => createTag(dataTransfer, body),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });
};
