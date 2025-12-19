import type { PrimaryKeyType } from '@/shared/types/api';

export interface Settings {
  id: PrimaryKeyType;
  api_key?: string;
  model?: string;
  temperature: number;
}
