import { type MaybeRef, type Ref } from 'vue';
import { queryOptions, useQuery } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { PrimaryKeyType } from '@/shared/types/api';
import type { MutationNoteBody } from './use-update-note';
import { getNoteWithTags } from '../api/tags/get-note-with-tags';
import type { Note } from '../model/types';

export const noteOptions = (id: MaybeRef<string>) => queryOptions<MutationNoteBody & Note>({
  queryKey: ['note', id],
});

export function useGetNote(id: Ref<PrimaryKeyType>) {
  const dataTransfer = useDbDataTransfer();

  return useQuery({
    ...noteOptions(id),
    queryFn: () => getNoteWithTags(dataTransfer, id.value),
  });
}
