import { useLsDataTransfer } from '@/app/providers/data-transfer';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { USER_QUICK_ACTION_ID } from '../api/config';
import { addQuickAction } from '../api/add-quick-action';

export const useAddQuickAction = () => {
  const lsDataTransfer = useLsDataTransfer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionId: string) => addQuickAction(lsDataTransfer, USER_QUICK_ACTION_ID, { action_id: actionId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['editor', 'quick-actions'] }),
  });
};
