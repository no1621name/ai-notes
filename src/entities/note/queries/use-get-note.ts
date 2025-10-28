import { toValue, type MaybeRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { useDbDataTransfer } from '@/app/providers/data-transfer';
import type { PrimaryKeyType } from '@/shared/types/api';
import { getNoteWithTags } from '../api/tags/get-note-with-tags';

export function useGetNote(id: MaybeRef<PrimaryKeyType>) {
  const dataTransfer = useDbDataTransfer();

  return useQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteWithTags(dataTransfer, toValue(id)),
  });
}
