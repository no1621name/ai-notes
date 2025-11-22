import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { getTag } from '@/entities/tag/@x/note';
import { addTagToNote } from '../../api/tags/add-tag-to-note';
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
      const notes = client.getQueryData<NoteShort[]>(notesOptions.queryKey);

      if (notes) {
        const noteIndex = notes.findIndex(note => note.id === body.noteId);

        if (noteIndex > -1) {
          const newNotes = [...notes];
          newNotes[noteIndex] = {
            ...notes[noteIndex],
            tags: [...notes[noteIndex].tags, newTag],
          };
          client.setQueryData(notesOptions.queryKey, newNotes);
        }
      }

      const note = client.getQueryData<Note>(noteKey);

      if (note) {
        const newNote = {
          ...note,
          tags: [...note.tags, newTag],
        };
        client.setQueryData(noteKey, newNote);
      }
    },
  });
};
