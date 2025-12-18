import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { QuickActionsItem, QuickActionItemBody } from './contracts';
import { QUICK_ACTION_STORE } from './config';

export const addQuickAction = async (dataTransfer: DataTransfer, id: PrimaryKeyType, body: QuickActionItemBody) => {
  const prevItem = await dataTransfer.getById<QuickActionsItem>(QUICK_ACTION_STORE, id);

  const actionsIds = new Set((prevItem?.quick_actions || []));
  actionsIds.add(body.action_id);

  await dataTransfer.update<QuickActionsItem>(QUICK_ACTION_STORE, {
    id,
    quick_actions: Array.from(actionsIds),
  });
};
