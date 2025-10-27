import type { Tag } from '@/entities/tag/@x/note';
import type { PrimaryKeyType } from '@/shared/types/api';

export interface NoteData {
  id: PrimaryKeyType;
  title: string;
  text: string;
  created_at: Date;
  reminder_date: Date | null;
}

export interface Note extends NoteData {
  tags: Tag[];
}

export type NoteTagRelation = Record<'id' | 'note_id' | 'tag_id', PrimaryKeyType>;
