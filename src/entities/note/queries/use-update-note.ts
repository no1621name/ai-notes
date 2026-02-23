import type { PrimaryKeyType } from '@/shared/types/api';
import { useMutation, useQueryClient, type DefaultError, type InfiniteData, type QueryFunctionContext } from '@tanstack/vue-query';
import { toValue, type MaybeRef } from 'vue';
import { updateNote } from '../api/update-note';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { NoteData, NoteShort } from '../model/types';
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

      client.setQueryData<NoteData>(['note', noteId], (oldData) => {
        if (!oldData) {
          return undefined;
        }

        return {
          ...oldData,
          ...payload,
        };
      });

      client.getQueriesData<InfiniteData<NoteShort[]>>({ queryKey: ['notes'], exact: false })
        .map(([queryKey, queryData]) => {
          client.setQueryData(queryKey, updateNoteInCache(queryData, noteId, (note) => {
            const updatedNote = {
              ...note,
              ...data,
            };

            if (data.text) {
              updatedNote.description = toDescription(JSON.parse(data.text));
            }

            return updatedNote;
          }));
        });
    },
  });
};
