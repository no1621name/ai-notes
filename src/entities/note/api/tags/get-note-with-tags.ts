import type { TagBody, WithTags } from '@/entities/tag/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import type { PrimaryKeyType } from '@/shared/types/api';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import type { NoteBody } from '../contracts';
import { noteToTagRelationConfig } from '../store-config';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getNoteWithTags = async (dataTransfer: DBDataTransfer, noteId: PrimaryKeyType): Promise<WithTags<NoteBody>> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  await sleep(3000);
  return relationManager.get<NoteBody, TagBody, 'tags'>(noteId);
};
