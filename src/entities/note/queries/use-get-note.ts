import { type MaybeRef, type Ref } from 'vue';
import { queryOptions, useQuery } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { PrimaryKeyType } from '@/shared/types/api';
import type { Note } from '../model/types';
import { getNoteWithTags } from '../api/tags/get-note-with-tags';

export const noteOptions = (id: MaybeRef<string>) => queryOptions<Note>({
  queryKey: ['note', id],
});

export function useGetNote(id: Ref<PrimaryKeyType>) {
  const dataTransfer = useDbDataTransfer();

  return useQuery({
    ...noteOptions(id),
    queryFn: () => getNoteWithTags(dataTransfer, id.value),
  });
}
