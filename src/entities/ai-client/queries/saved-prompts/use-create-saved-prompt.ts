import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';
import { createSavedPrompt } from '../../api/data-transfer/saved-prompts/create-saved-prompt';
import type { SavedPromptBody } from '../../api/data-transfer/saved-prompts/contracts';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { savedPromptsOptions } from './use-get-saved-prompts';
import type { SavedPrompt } from '../../model/types';

export const useCreateSavedPrompt = () => {
  const dataTransfer = useDbDataTransfer();
  const client = useQueryClient();

  return useMutation<string, DefaultError, SavedPromptBody>({
    mutationFn: body => createSavedPrompt(dataTransfer, body),
    onSuccess: (id, body) => {
      const newItem: SavedPrompt = {
        id,
        ...body,
        created_at: new Date(Date.now()),
      };

      client.setQueryData(savedPromptsOptions.queryKey, (oldPrompts) => {
        if (!oldPrompts) {
          return [newItem];
        }

        return [newItem, ...oldPrompts];
      });
    },
  });
};
