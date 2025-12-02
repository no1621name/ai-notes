import type { WithTags, TagBody } from '@/entities/tag/@x/note';
import { toDescription } from '@/entities/md-editor/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import type { NoteBody, NoteShort } from '../contracts';
import { noteToTagRelationConfig } from '../store-config';

export const getNotesWithTags = async (dataTransfer: DBDataTransfer): Promise<WithTags<NoteShort>[]> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  const notesWithTags = await relationManager.getAll<NoteBody, TagBody, 'tags'>();
  return notesWithTags.map<WithTags<NoteShort> | null>(({ text, ...note }) => ({
    ...note,
    description: text ? toDescription(JSON.parse(text)) : '',
  })).filter(Boolean) as WithTags<NoteShort>[];
};
