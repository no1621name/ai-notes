import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { NoteBody } from './contracts';
import { storeConfig } from './store-config';
import { setReminder } from './reminder/create-reminder';
import { updateReminderTitle } from './reminder/update-title';
import { deleteReminder as deleteReminderApi } from './reminder/delete-reminder';

interface ReminderOptions {
  deleteReminder?: boolean;
  reminderTitle?: string;
}

export const updateNote = async (
  dataTransfer: DataTransfer,
  id: PrimaryKeyType,
  body: Partial<NoteBody>,
  { reminderTitle, deleteReminder = true }: ReminderOptions = {},
) => {
  const { created_at, updated_at, reminder_date, ...rest } = body;

  if ('reminder_date' in body) {
    if (reminder_date) {
      const title = body.title || reminderTitle || 'Reminder';
      await setReminder(id as string, reminder_date.toISOString(), title);
    } else if (deleteReminder) {
      await deleteReminderApi(id as string);
    }
  }

  if (body.title) {
    const currentNote = await dataTransfer.getById<NoteBody>(storeConfig.name, id);
    if (currentNote?.reminder_date) {
      await updateReminderTitle(id as string, body.title);
    }
  }

  return dataTransfer.update<NoteBody>(storeConfig.name, {
    ...rest,
    id,
    updated_at: new Date(Date.now()),
    ...(reminder_date !== undefined && { reminder_date }),
  });
};
