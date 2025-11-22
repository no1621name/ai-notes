import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { removeTagFromNote } from '../../api/tags/remove-tag-from-note';
import { notesOptions } from '../use-get-notes';
import { noteOptions } from '../use-get-note';

type RemoveTagFromNoteBody = Record<'noteId' | 'tagId', string>;

export const useRemoveTagFromNote = () => {
  const dataTransfer = useDbDataTransfer();
  const client = useQueryClient();

  return useMutation<void, DefaultError, RemoveTagFromNoteBody>({
    mutationFn: body => removeTagFromNote(dataTransfer, body.noteId, body.tagId),
    onSuccess: (_, body) => {
      const noteKey = noteOptions(body.noteId).queryKey;
      const notes = client.getQueryData(notesOptions.queryKey);

      if (notes) {
        const noteIndex = notes.findIndex(note => note.id === body.noteId);
        if (noteIndex > -1) {
          const newNotes = [...notes];
          newNotes[noteIndex] = {
            ...notes[noteIndex],
            tags: notes[noteIndex].tags.filter(tag => tag.id !== body.tagId),
          };
          client.setQueryData(notesOptions.queryKey, newNotes);
        }
      }

      const note = client.getQueryData(noteKey);
      if (note) {
        const newNote = {
          ...note,
          tags: note.tags.filter(tag => tag.id !== body.tagId),
        };
        client.setQueryData(noteKey, newNote);
      }
    },
  });
};
