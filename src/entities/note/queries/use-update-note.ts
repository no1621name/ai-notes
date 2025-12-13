import type { PrimaryKeyType } from '@/shared/types/api';
import { useMutation, useQueryClient, type DefaultError, type QueryFunctionContext } from '@tanstack/vue-query';
import { toValue, type MaybeRef } from 'vue';
import { updateNote } from '../api/update-note';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { NoteData } from '../model/types';
import { notesOptions } from './use-get-notes';
import { toDescription } from '@/entities/md-editor/@x/note';
import { updateNoteInCache } from '../lib/update-note-in-cache';

export type MutationNoteBody = NoteData & { __mutationId?: number };

export const useUpdateNote = (id: MaybeRef<PrimaryKeyType>) => {
  const client = useQueryClient();
  const dataTransfer = useDbDataTransfer();

  return useMutation<MutationNoteBody, DefaultError, { body: Partial<MutationNoteBody>; reminderTitle?: string }, QueryFunctionContext>({
    mutationFn: async ({ body, reminderTitle }) => {
      const { __mutationId, ...data } = body;
      return updateNote(dataTransfer, toValue(id), data, { reminderTitle });
    },
    onSuccess: (data, variables) => {
      const noteId = toValue(id);

      const payload: MutationNoteBody = {
        ...data,
        __mutationId: variables.body.__mutationId,
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

      const notesData = client.getQueryData(notesOptions().queryKey);

      client.setQueryData(notesOptions().queryKey, updateNoteInCache(notesData, noteId, (note) => {
        const updatedNote = {
          ...note,
          ...data,
        };

        if (data.text) {
          updatedNote.description = toDescription(JSON.parse(data.text));
        }

        return updatedNote;
      }));
    },
  });
};
