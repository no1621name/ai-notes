import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { useQuery } from '@tanstack/vue-query';
import { getNotesWithTags } from '../api/tags/get-notes-with-tags';

export const useGetNotes = () => {
  const dataTransfer = useDbDataTransfer();

  return useQuery({
    queryKey: ['notes'],
    queryFn: () => getNotesWithTags(dataTransfer),
  });
};
