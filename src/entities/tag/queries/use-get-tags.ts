import type { Tag } from '../model/types';
import { queryOptions, useQuery } from '@tanstack/vue-query';
import { getTags } from '../api/get-tags';
import { useDbDataTransfer } from '@/app/providers/data-transfer';

export const tagsOptions = queryOptions<Tag[]>({
  queryKey: ['tags'],
});

export const useGetTags = () => {
  const dataTransfer = useDbDataTransfer();

  return useQuery({
    ...tagsOptions,
    queryFn: () => getTags(dataTransfer),
  });
};
