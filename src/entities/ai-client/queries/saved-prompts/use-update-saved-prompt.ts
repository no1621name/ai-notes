import { toValue, type MaybeRef } from 'vue';

import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { updateSavedPrompt } from '../../api/data-transfer/saved-prompts/update-saved-prompt';
import { savedPromptsOptions } from './use-get-saved-prompts';
import type { PrimaryKeyType } from '@/shared/types/api';
import type { SavedPromptBody } from '../../api/data-transfer/saved-prompts/contracts';
import type { SavedPrompt } from '../../model/types';

export const useUpdateSavedPrompt = (id: MaybeRef<PrimaryKeyType | null>) => {
  const dataTransfer = useDbDataTransfer();
  const client = useQueryClient();

  return useMutation<SavedPrompt, DefaultError, SavedPromptBody>({
    mutationFn: (body) => {
      const idValue = toValue(id);

      if (!idValue) {
        throw new Error('ID is required');
      }

      return updateSavedPrompt(dataTransfer, idValue, body);
    },
    onSuccess: (newItem) => {
      client.setQueryData<SavedPrompt[]>(savedPromptsOptions.queryKey, (oldPrompts) => {
        if (!oldPrompts) {
          return [newItem];
        }

        return oldPrompts.map(prompt => (prompt.id === newItem.id ? newItem : prompt));
      });
    },
  });
};
