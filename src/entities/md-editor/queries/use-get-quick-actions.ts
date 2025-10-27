import { useLsDataTransfer } from '@/app/providers/data-transfer';
import { useQuery } from '@tanstack/vue-query';
import { getQuickActions } from '../api/get-quick-actions';
import { DEFAULT_FORMATTING_ACTIONS } from '../model/config';
import type { EditorAction } from '../model/types';

export function useGetQuickActions() {
  const lsDataTransfer = useLsDataTransfer();

  return useQuery({
    queryKey: ['editor', 'quick-actions'],
    queryFn: () => getQuickActions(lsDataTransfer),
    select: data =>
      data.quick_actions.map(quickActionId =>
        DEFAULT_FORMATTING_ACTIONS.find(action => action.id === quickActionId),
      ).filter(Boolean) as EditorAction[],
  });
}
