import type { Tag } from '../model/types';
import { useQuery } from '@tanstack/vue-query';
import { getTags } from '../api/get-tags';
import { useDbDataTransfer } from '@/app/providers/data-transfer';

export const useGetTags = () => {
  const dataTransfer = useDbDataTransfer();

  return useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(dataTransfer),
  });
};
