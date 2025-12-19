import type { DataTransfer } from '@/shared/types/api';
import type { Settings } from './contracts';
import { AI_CLIENT_SETTINGS_ID, AI_CLIENT_SETTINGS_STORE } from './config';

export const getSettings = async (dataTransfer: DataTransfer): Promise<Settings> => {
  let settings: Settings;

  try {
    settings = await dataTransfer.getById(AI_CLIENT_SETTINGS_STORE, AI_CLIENT_SETTINGS_ID);
  } catch {
    const defaultSettings = {
      id: AI_CLIENT_SETTINGS_ID,
      api_key: undefined,
      model: undefined,
      temperature: 1,
    };

    await dataTransfer.create(AI_CLIENT_SETTINGS_STORE, defaultSettings);
    settings = defaultSettings;
  }

  return settings;
};
