import type { Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AiModel } from '../model/types';

type GetModelsFn = () => Promise<AiModel[]>;

export const useGetModels = (getModels: GetModelsFn, enabled: Ref<boolean>) => {
  return useQuery({
    queryKey: ['ai-client', 'models'],
    queryFn: () => getModels(),
    enabled,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
