import type { DataTransfer } from '@/shared/types/api';
import { DEFAULT_QUICK_ACTIONS } from '../model/config';
import type { QuickActionsItem } from './contracts';
import { QUICK_ACTION_STORE, USER_QUICK_ACTION_ID } from './config';

export const getQuickActions = async (dataTransfer: DataTransfer): Promise<QuickActionsItem> => {
  const quickActions = await dataTransfer.getById<QuickActionsItem>(QUICK_ACTION_STORE, USER_QUICK_ACTION_ID);

  if (!quickActions) {
    const defautItemBody = {
      id: USER_QUICK_ACTION_ID,
      quick_actions: DEFAULT_QUICK_ACTIONS,
    };

    await dataTransfer.create<QuickActionsItem>(QUICK_ACTION_STORE, defautItemBody);
    return defautItemBody;
  }

  return quickActions;
};
