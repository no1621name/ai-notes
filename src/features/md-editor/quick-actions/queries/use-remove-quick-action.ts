import { useLsDataTransfer } from '@/app/providers/data-transfer';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { USER_QUICK_ACTION_ID } from '../api/config';
import { removeQuickAction } from '../api/remove-quick-action';

export const useRemoveQuickAction = () => {
  const lsDataTransfer = useLsDataTransfer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionId: string) => removeQuickAction(lsDataTransfer, USER_QUICK_ACTION_ID, { action_id: actionId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['editor', 'quick-actions'] }),
  });
};
