import { useQuery } from '@tanstack/vue-query';

import { useLsDataTransfer } from '@/app/providers/data-transfer';
import type { EditorAction } from '@/entities/md-editor';
import { getQuickActions } from '../api/get-quick-actions';

export function useGetQuickActions(formattingActions: EditorAction[]) {
  const lsDataTransfer = useLsDataTransfer();

  return useQuery({
    queryKey: ['editor', 'quick-actions'],
    queryFn: () => getQuickActions(lsDataTransfer),
    select: data =>
      data.quick_actions.map(quickActionId =>
        formattingActions.find(action => action.id === quickActionId),
      ).filter(Boolean) as EditorAction[],
  });
}
