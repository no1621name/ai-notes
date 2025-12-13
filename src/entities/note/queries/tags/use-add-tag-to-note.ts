import { useMutation, useQueryClient, type DefaultError, type InfiniteData } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { getTag } from '@/entities/tag/@x/note';
import { addTagToNote } from '../../api/tags/add-tag-to-note';
import { updateNoteInCache } from '../../lib/update-note-in-cache';
import { notesOptions } from '../use-get-notes';
import type { Note, NoteShort } from '../../model/types';
import { noteOptions } from '../use-get-note';

type AddTagToNoteBody = Record<'noteId' | 'tagId', string>;

export const useAddTagToNote = () => {
  const dataTransfer = useDbDataTransfer();
  const client = useQueryClient();

  return useMutation<string, DefaultError, AddTagToNoteBody>({
    mutationFn: body => addTagToNote(dataTransfer, body.noteId, body.tagId),
    onSuccess: async (_, body) => {
      const newTag = await getTag(dataTransfer, body.tagId);

      if (!newTag) {
        return;
      }

      const noteKey = noteOptions(body.noteId).queryKey;
      const note = client.getQueryData<Note>(noteKey);

      if (note) {
        const newNote = {
          ...note,
          tags: [...note.tags, newTag],
        };
        client.setQueryData(noteKey, newNote);
      }

      const notesData = client.getQueryData<InfiniteData<NoteShort[]>>(notesOptions().queryKey);

      client.setQueryData(notesOptions().queryKey, updateNoteInCache(notesData, body.noteId, note => ({
        ...note,
        tags: [...note.tags, newTag],
      })));
    },
  });
};
