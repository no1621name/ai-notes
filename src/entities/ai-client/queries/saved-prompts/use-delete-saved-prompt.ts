import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { deleteSavedPrompt } from '../../api/data-transfer/saved-prompts/delete-saved-prompt';
import { savedPromptsOptions } from './use-get-saved-prompts';

export const useDeleteSavedPrompt = () => {
  const dataTransfer = useDbDataTransfer();
  const client = useQueryClient();

  return useMutation<void, DefaultError, string>({
    mutationFn: id => deleteSavedPrompt(dataTransfer, id),
    onSuccess: (_, id) => {
      client.setQueryData(savedPromptsOptions.queryKey, (oldPrompts) => {
        if (!oldPrompts) {
          return [];
        }

        return oldPrompts.filter(prompt => prompt.id !== id);
      });
    },
  });
};
