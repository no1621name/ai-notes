import { queryOptions, useQuery } from '@tanstack/vue-query';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { getSavedPrompts } from '../../api/data-transfer/saved-prompts/get-propmts';
import type { SavedPrompt } from '../../model/types';

export const savedPromptsOptions = queryOptions<SavedPrompt[]>({
  queryKey: ['ai-client', 'saved-prompts'],
});

export const useGetSavedPrompts = () => {
  const dataTransfer = useDbDataTransfer();

  return useQuery<SavedPrompt[]>({
    ...savedPromptsOptions,
    queryFn: () => getSavedPrompts(dataTransfer),
  });
};
