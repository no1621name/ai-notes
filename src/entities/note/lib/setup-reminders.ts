import type { ErrorNotifier } from '@/shared/api/errors/error-notifier';
import type { DataTransfer } from '@/shared/types/api';
import { registerPush } from './register-reminder-service';
import { updateNote } from '../api/update-note';
import { getFiredReminders, clearAllFiredReminders } from './fired-reminders';
import { onBroadcastMessage } from '@/shared/lib/broadcast';
import type { QueryClient } from '@tanstack/vue-query';
import type { Note, NoteShort } from '../model/types';

const clearFiredReminders = async (
  dataTransfer: DataTransfer,
  messagesDataTransfer: DataTransfer,
  queryClient?: QueryClient,
) => {
  const noteIds = await getFiredReminders(messagesDataTransfer);

  if (noteIds.length === 0) return;

  try {
    for (const noteId of noteIds) {
      await updateNote(dataTransfer, noteId, { reminder_date: null }, { deleteReminder: false });

      if (queryClient) {
        queryClient.setQueryData<Note>(['note', noteId], (oldData) => {
          if (!oldData) return oldData;
          return { ...oldData, reminder_date: null };
        });

        queryClient.setQueryData<NoteShort[]>(['notes'], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(note =>
            note.id === noteId ? { ...note, reminder_date: null } : note,
          );
        });
      }
    }
    await clearAllFiredReminders(messagesDataTransfer);
  } catch (error) {
    console.error('Failed to clear fired reminders:', error);
  }
};

const listenForReminders = (
  dataTransfer: DataTransfer,
  messagesDataTransfer: DataTransfer,
  queryClient: QueryClient,
) => {
  onBroadcastMessage<{ noteId: string }>('REMINDER_FIRED', async () => {
    await clearFiredReminders(dataTransfer, messagesDataTransfer, queryClient);
  });
};

export const setupReminders = async (
  dataTransfer: DataTransfer,
  messagesDataTransfer: DataTransfer,
  notifier: ErrorNotifier,
  queryClient: QueryClient,
) => {
  await clearFiredReminders(dataTransfer, messagesDataTransfer, queryClient);

  listenForReminders(dataTransfer, messagesDataTransfer, queryClient);

  await registerPush().catch((error: Error) => {
    notifier.add({
      title: error.message,
      type: 'danger',
      message: 'Visit Info page',
    });
  });
};
