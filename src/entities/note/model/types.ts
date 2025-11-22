import type { WithTags } from '@/entities/tag/@x/note';
import type { PrimaryKeyType } from '@/shared/types/api';

export interface NoteData {
  id: PrimaryKeyType;
  title: string;
  text: string;
  created_at: Date;
  updated_at: Date;
  reminder_date: Date | null;
}

export type Note = WithTags<NoteData>;

export interface NoteShort extends Omit<Note, 'text'> {
  description: string;
}
