import { computed, watch, type Ref } from 'vue';
import { GroqService } from '../api/services/groq';
import { useGetSettings } from '../queries/use-get-settings';
import type { AiModel, AiService, AiSettings } from '../model/types';
import { useGetModels } from '../queries/use-get-models';

const client = new GroqService();

type UseAiClinent = () => {
  client: AiService;
  settings: Ref<AiSettings | undefined>;
  isLoadingSettings: Ref<boolean>;
  isLoadingModels: Ref<boolean>;
  settingsHasValidApiKey: Ref<boolean>;
  models: Ref<AiModel[] | undefined>;
};

export const useAiClient: UseAiClinent = () => {
  const { data: settings, isLoading: isLoadingSettings } = useGetSettings();
  const settingsHasValidApiKey = computed(() => !!settings.value?.apiKey?.match(client.apiKeyRegex));

  const { data: models, refetch: refetchModels, isLoading: isLoadingModels } = useGetModels(() => client.getModels(), settingsHasValidApiKey);

  watch(settings, (newSettings, prevSettings) => {
    if (newSettings?.apiKey) {
      client.updateApiKey(newSettings.apiKey);

      if (settingsHasValidApiKey.value && !!prevSettings && newSettings.apiKey !== prevSettings.apiKey) {
        refetchModels();
      }
    }
  });

  return {
    client,
    settings,
    isLoadingSettings,
    isLoadingModels,
    settingsHasValidApiKey,
    models,
  };
};
