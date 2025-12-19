import type { DataTransfer } from '@/shared/types/api';
import { AI_CLIENT_SETTINGS_ID, AI_CLIENT_SETTINGS_STORE } from './config';
import type { Settings } from './contracts';

export const updateSettings = async (dataTransfer: DataTransfer, settings: Partial<Omit<Settings, 'id'>>): Promise<void> => {
  await dataTransfer.update(AI_CLIENT_SETTINGS_STORE, { ...settings, id: AI_CLIENT_SETTINGS_ID });
};
