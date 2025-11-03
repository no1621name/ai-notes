import { generateText } from '@tiptap/vue-3';

import type { WithTags, TagBody } from '@/entities/tag/@x/note';
import { plugins } from '@/entities/md-editor/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import type { NoteBody, NoteShort } from '../contracts';
import { noteToTagRelationConfig } from '../store-config';

export const getNotesWithTags = async (dataTransfer: DBDataTransfer): Promise<WithTags<NoteShort>[]> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  const notesWithTags = await relationManager.getAll<NoteBody, TagBody, 'tags'>();
  return notesWithTags.map<WithTags<NoteShort> | null>(({ text, ...note }) => {
    if (text) {
      return ({
        ...note,
        description: generateText(JSON.parse(text), plugins),
      });
    }
    return null;
  }).filter(Boolean) as WithTags<NoteShort>[];
};
