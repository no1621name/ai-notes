import { useMutation, useQueryClient, type DefaultError } from '@tanstack/vue-query';
import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { NoteData, NoteShort } from '../model/types';
import { createNote } from '../api/create-note';
import { notesOptions } from './use-get-notes';

export const useCreateNote = () => {
  const client = useQueryClient();
  const dataTransfer = useDbDataTransfer();

  return useMutation<NoteData, DefaultError, string>({
    mutationFn: async (title) => {
      console.log('SDFSDFSDF', title);
      const id = await createNote(dataTransfer, {
        title,
        text: '',
        reminder_date: null,
      });

      return {
        id,
        title,
        text: '',
        tags: [],
        reminder_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
    },
    onSuccess: (data) => {
      client.setQueryData<NoteData>(['note', data.id], data);

      client.setQueryData<NoteShort[]>(notesOptions.queryKey, (oldNotes) => {
        if (!oldNotes) {
          return undefined;
        }

        const newNote: NoteShort = {
          ...data,
          description: '',
          tags: [],
        };

        return [
          newNote,
          ...oldNotes,
        ];
      });
    },
  });
};
