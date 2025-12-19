import { useLsDataTransfer } from '@/app/providers/data-transfer';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateSettings } from '../api/data-transfer/settings/update-settings';
import type { Settings } from '../api/data-transfer/settings/contracts';
import { useGetSettingsOptions } from './use-get-settings';

export const useUpdateSettings = () => {
  const lsDataTransfer = useLsDataTransfer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<Settings>) => updateSettings(lsDataTransfer, settings),
    onSuccess: () => {
      queryClient.invalidateQueries(useGetSettingsOptions);
    },
  });
};
