import type { PrimaryKeyType } from '@/shared/types/api';
import { useMutation, useQueryClient, type DefaultError, type QueryFunctionContext } from '@tanstack/vue-query';
import { toValue, type MaybeRef } from 'vue';
import { updateNote } from '../api/update-note';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { NoteData } from '../model/types';
import { notesOptions } from './use-get-notes';
import { toDescription } from '@/entities/md-editor/@x/note';

export type MutationNoteBody = NoteData & { __mutationId?: number };

export const useUpdateNote = (id: MaybeRef<PrimaryKeyType>) => {
  const client = useQueryClient();
  const dataTransfer = useDbDataTransfer();

  return useMutation<MutationNoteBody, DefaultError, Partial<MutationNoteBody>, QueryFunctionContext>({
    mutationFn: async (body) => {
      const { __mutationId, ...data } = body;
      return updateNote(dataTransfer, toValue(id), data);
    },
    onSuccess: (data, variables) => {
      const noteId = toValue(id);

      const payload: MutationNoteBody = {
        ...data,
        __mutationId: variables.__mutationId,
      };

      client.setQueryData<NoteData>(['note', id], (oldData) => {
        if (!oldData) {
          return undefined;
        }

        return {
          ...oldData,
          ...payload,
        };
      });

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
        ...data,
      };

      if (data.text) {
        newNotes[noteIndex].description = toDescription(JSON.parse(data.text));
      }

      client.setQueryData(notesOptions.queryKey, newNotes);
    },
  });
};
