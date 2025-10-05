import type { PrimaryKeyType } from '@/shared/types/api';

export interface Note {
  id: PrimaryKeyType;
  name: string;
  created_at: Date;
}
