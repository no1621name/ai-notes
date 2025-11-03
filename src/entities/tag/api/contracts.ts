import type { PrimaryKeyType } from '@/shared/types/api';

export interface TagBody {
  id: PrimaryKeyType;
  name: string;
  color: string;
  created_at: Date;
}
