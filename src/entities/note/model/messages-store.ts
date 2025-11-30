import { type DataStore, SchemaFieldType } from '@/shared/types/api';

export interface FiredReminderMessage {
  id: string;
  note_id: string;
  timestamp: number;
}

export const messagesStoreConfig: DataStore = {
  name: 'fired_reminders',
  primaryKey: 'id',
  schema: {
    note_id: SchemaFieldType.NOT_UNIQUE,
    timestamp: SchemaFieldType.NOT_UNIQUE,
  },
};
