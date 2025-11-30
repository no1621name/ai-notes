import type { DataTransfer } from '@/shared/types/api';
import { messagesStoreConfig, type FiredReminderMessage } from '../model/messages-store';

export const getFiredReminders = async (dataTransfer: DataTransfer): Promise<string[]> => {
  try {
    const messages = await dataTransfer.getAll<FiredReminderMessage>(messagesStoreConfig.name);
    return messages.map(m => m.note_id);
  } catch {
    return [];
  }
};

export const clearAllFiredReminders = async (dataTransfer: DataTransfer): Promise<void> => {
  try {
    const messages = await dataTransfer.getAll<FiredReminderMessage>(messagesStoreConfig.name);

    for (const message of messages) {
      await dataTransfer.delete(messagesStoreConfig.name, message.id);
    }
  } catch (error) {
    console.error('Failed to clear fired reminders:', error);
  }
};
