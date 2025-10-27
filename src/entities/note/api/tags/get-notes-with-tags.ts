import type { Tag } from '@/entities/tag/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import type { Note, NoteData } from '../../model/types';
import { noteToTagRelationConfig } from '../store-config';

export const getNotesWithTags = (dataTransfer: DBDataTransfer): Promise<Note[]> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  return relationManager.getAll<NoteData, Tag, 'tags'>();
};
