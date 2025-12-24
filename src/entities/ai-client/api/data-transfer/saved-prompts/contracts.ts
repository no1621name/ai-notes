import type { PrimaryKeyType } from '@/shared/types/api';

export interface SavedPrompt {
  id: PrimaryKeyType;
  name: string;
  prompt: string;
  created_at: Date;
}

export type SavedPromptBody = Omit<SavedPrompt, 'id' | 'created_at'>;
