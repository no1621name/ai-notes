import { queryOptions, useQuery, type DefaultError } from '@tanstack/vue-query';
import { useLsDataTransfer } from '@/app/providers/data-transfer';
import { getSettings } from '../api/data-transfer/settings/get-settings';
import type { Settings } from '../api/data-transfer/settings/contracts';
import type { AiSettings } from '../model/types';

export const useGetSettingsOptions = queryOptions<Settings, DefaultError, AiSettings>({
  queryKey: ['ai-client', 'settings'],
});

export const useGetSettings = () => {
  const lsDataTransfer = useLsDataTransfer();

  return useQuery({
    ...useGetSettingsOptions,
    queryFn: () => getSettings(lsDataTransfer),
    select: data => ({
      apiKey: data.api_key,
      model: data.model,
      temperature: data.temperature,
    }),
  });
};
