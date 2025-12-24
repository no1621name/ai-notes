import type { TagBody, WithTags } from '@/entities/tag/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import type { PrimaryKeyType } from '@/shared/types/api';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import type { NoteBody } from '../contracts';
import { noteToTagRelationConfig } from '../store-config';

export const getNoteWithTags = async (dataTransfer: DBDataTransfer, noteId: PrimaryKeyType): Promise<WithTags<NoteBody>> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  return relationManager.get<NoteBody, TagBody, 'tags'>(noteId);
};
