import { watch, type Ref } from 'vue';
import { GroqService } from '../api/services/groq';
import { useGetSettings } from '../queries/use-get-settings';
import type { AiService, AiSettings } from '../model/types';

const client = new GroqService();

type UseAiClinent = () => { client: AiService; settings: Ref<AiSettings | undefined> };

export const useAiClient: UseAiClinent = () => {
  const { data: settings } = useGetSettings();

  watch(settings, () => {
    if (settings.value) {
      client.updateApiKey(settings.value.apiKey);
    }
  });

  return { client, settings };
};
