import { queryOptions, useQuery } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { NoteShort } from '../model/types';
import { getNotesWithTags } from '../api/tags/get-notes-with-tags';

export const notesOptions = queryOptions<NoteShort[]>({
  queryKey: ['notes'],
});

export const useGetNotes = () => {
  const dataTransfer = useDbDataTransfer();

  return useQuery({
    ...notesOptions,
    queryFn: () => getNotesWithTags(dataTransfer),
  });
};
