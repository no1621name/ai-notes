import { infiniteQueryOptions, useInfiniteQuery, type InfiniteData } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { getNotesWithTags } from '../api/tags/get-notes-with-tags';
import type { NoteShort } from '../model/types';
import type { WithTags } from '@/entities/tag/@x/note';

const PAGE_SIZE = 5;

export const notesOptions = infiniteQueryOptions<WithTags<NoteShort>[], Error, InfiniteData<WithTags<NoteShort>[]>, ['notes'], number>({
  queryKey: ['notes'],
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
  },
});

export const useGetNotes = () => {
  const dataTransfer = useDbDataTransfer();

  return useInfiniteQuery({
    ...notesOptions,
    queryFn: ({ pageParam }) => getNotesWithTags(dataTransfer, pageParam, PAGE_SIZE),
  });
};
