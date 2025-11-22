import type { PrimaryKeyType } from '@/shared/types/api';
import { useMutation, useQueryClient, type DefaultError, type QueryFunctionContext } from '@tanstack/vue-query';
import { toValue, type MaybeRef } from 'vue';
import { updateNote } from '../api/update-note';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { NoteData } from '../model/types';
import { notesOptions } from './use-get-notes';
import { toDescription } from '@/entities/md-editor/@x/note';

export const useUpdateNote = (id: MaybeRef<PrimaryKeyType>) => {
  const client = useQueryClient();
  const dataTransfer = useDbDataTransfer();
  const noteId = toValue(id);

  return useMutation<string, DefaultError, Partial<NoteData>, QueryFunctionContext>({
    mutationFn: body => updateNote(dataTransfer, noteId, body),
    onSuccess: (_data, body) => {
      const notes = client.getQueryData(notesOptions.queryKey);

      if (!notes) {
        return;
      }

      const noteIndex = notes.findIndex(note => note.id === noteId) ?? -1;

      if (noteIndex < 0) {
        return;
      }

      const newNotes = [...notes];
      newNotes[noteIndex] = {
        ...notes[noteIndex],
        ...body,
        updated_at: new Date(Date.now()),
      };

      if (body?.text) {
        newNotes[noteIndex].description = toDescription(JSON.parse(body.text));
      }

      client.setQueryData(notesOptions.queryKey, newNotes);
    },
  });
};
