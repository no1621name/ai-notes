import type { PrimaryKeyType } from '@/shared/types/api';

export interface Tag {
  id: PrimaryKeyType;
  name: string;
  color: string;
  created_at: Date;
}
