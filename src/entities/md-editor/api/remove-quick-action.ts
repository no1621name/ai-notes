import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { QuickActionsItem, QuickActionItemBody } from './contracts';
import { QUICK_ACTION_STORE } from './config';

export const removeQuickAction = async (dataTransfer: DataTransfer, id: PrimaryKeyType, body: QuickActionItemBody) => {
  const prevItem = await dataTransfer.getById<QuickActionsItem>(QUICK_ACTION_STORE, id);

  await dataTransfer.update<QuickActionsItem>(QUICK_ACTION_STORE, {
    id,
    quick_actions: prevItem?.quick_actions.filter(action => action !== body.action_id) ?? [],
  });
};
