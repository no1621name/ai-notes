import { toValue, type MaybeRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { useDataTransfer } from '@/app/providers/data-transfer';
import type { PrimaryKeyType } from '@/shared/types/api';
import { getNote } from '../api/get-note';

export function useGetNote(id: MaybeRef<PrimaryKeyType>) {
  const dataTransfer = useDataTransfer();

  return useQuery({
    queryKey: ['note', id],
    queryFn: () => getNote(dataTransfer, toValue(id)),
  });
}
