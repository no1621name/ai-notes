import { useLsDataTransfer } from '@/app/providers/data-transfer';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateSettings } from '../api/data-transfer/settings/update-settings';
import { useGetSettingsOptions } from './use-get-settings';
import type { AiSettings } from '../model/types';
import type { Settings } from '../api/data-transfer/settings/contracts';

const toBody = ({ apiKey, ...rest }: Partial<AiSettings>): Partial<Settings> => ({
  ...rest,
  ...(apiKey !== undefined && { api_key: apiKey }),
});

export const useUpdateSettings = () => {
  const lsDataTransfer = useLsDataTransfer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<AiSettings>) => updateSettings(lsDataTransfer, toBody(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useGetSettingsOptions.queryKey });
    },
  });
};
