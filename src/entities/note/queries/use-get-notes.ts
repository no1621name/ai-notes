import { infiniteQueryOptions, useInfiniteQuery, type InfiniteData } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { getNotesWithTags } from '../api/tags/get-notes-with-tags';
import type { NoteShort } from '../model/types';
import type { WithTags } from '@/entities/tag/@x/note';
import type { MaybeRef, Ref } from 'vue';

const PAGE_SIZE = 5;

export const notesOptions = (searchQuery: MaybeRef<string> = '') => infiniteQueryOptions<WithTags<NoteShort>[], Error, InfiniteData<WithTags<NoteShort>[]>, ['notes', MaybeRef<string> | undefined], number>({
  queryKey: ['notes', searchQuery],
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
  },
});

export const useGetNotes = (search: Ref<string>) => {
  const dataTransfer = useDbDataTransfer();

  return useInfiniteQuery({
    ...notesOptions(search),
    queryFn: ({ pageParam }) => {
      return getNotesWithTags(dataTransfer, {
        page: pageParam,
        pageSize: PAGE_SIZE,
        search: {
          fields: ['text', 'title'],
          text: search.value,
        },
      });
    },
  });
};
