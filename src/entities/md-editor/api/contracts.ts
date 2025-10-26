import type { PrimaryKeyType } from '@/shared/types/api';

export interface QuickActionsItem {
  id: PrimaryKeyType;
  quick_actions: string[];
}

export interface QuickActionItemBody {
  action_id: string;
}
