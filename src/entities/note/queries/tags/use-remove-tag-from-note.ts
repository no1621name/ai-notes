import { useMutation, useQueryClient, type DefaultError, type InfiniteData } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { removeTagFromNote } from '../../api/tags/remove-tag-from-note';
import { updateNoteInCache } from '../../lib/update-note-in-cache';
import { notesOptions } from '../use-get-notes';
import type { NoteShort } from '../../model/types';
import { noteOptions } from '../use-get-note';

type RemoveTagFromNoteBody = Record<'noteId' | 'tagId', string>;

export const useRemoveTagFromNote = () => {
  const dataTransfer = useDbDataTransfer();
  const client = useQueryClient();

  return useMutation<void, DefaultError, RemoveTagFromNoteBody>({
    mutationFn: body => removeTagFromNote(dataTransfer, body.noteId, body.tagId),
    onSuccess: (_, body) => {
      const noteKey = noteOptions(body.noteId).queryKey;
      const note = client.getQueryData(noteKey);
      if (note) {
        const newNote = {
          ...note,
          tags: note.tags.filter(tag => tag.id !== body.tagId),
        };
        client.setQueryData(noteKey, newNote);
      }

      const notesData = client.getQueryData<InfiniteData<NoteShort[]>>(notesOptions().queryKey);

      client.setQueryData(notesOptions().queryKey, updateNoteInCache(notesData, body.noteId, note => ({
        ...note,
        tags: note.tags.filter(tag => tag.id !== body.tagId),
      })));
    },
  });
};
