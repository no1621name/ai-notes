import { infiniteQueryOptions, useInfiniteQuery, type InfiniteData } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import { getNotesWithTags } from '../api/tags/get-notes-with-tags';
import type { NoteShort } from '../model/types';
import type { WithTags } from '@/entities/tag/@x/note';
import { toValue, type MaybeRef } from 'vue';

const PAGE_SIZE = 5;

interface UseGetNotesKeys {
  search?: MaybeRef<string>;
  tags?: MaybeRef<string[]>;
}

export const notesOptions = (options: UseGetNotesKeys = { search: '', tags: [] }) => infiniteQueryOptions<WithTags<NoteShort>[], Error, InfiniteData<WithTags<NoteShort>[]>, ['notes', MaybeRef<string> | undefined, MaybeRef<string[]> | undefined], number>({
  queryKey: ['notes', options.search, options.tags],
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
  },
});

export const useGetNotes = ({ search, tags }: UseGetNotesKeys) => {
  const dataTransfer = useDbDataTransfer();

  return useInfiniteQuery({
    ...notesOptions({ search, tags }),
    queryFn: ({ pageParam }) => {
      return getNotesWithTags(dataTransfer, {
        page: pageParam,
        pageSize: PAGE_SIZE,
        search: {
          fields: ['text', 'title'],
          text: toValue(search) ?? '',
        },
        tags: toValue(tags),
      });
    },
  });
};
