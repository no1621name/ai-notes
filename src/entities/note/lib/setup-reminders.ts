import type { InfiniteData, QueryClient } from '@tanstack/vue-query';

import type { Note, NoteShort } from '../model/types';
import type { ErrorNotifier } from '@/shared/api/errors/error-notifier';
import type { DataTransfer } from '@/shared/types/api';

import { registerPush } from './register-reminder-service';
import { updateNote } from '../api/update-note';
import { getFiredReminders, clearAllFiredReminders } from './fired-reminders';
import { updateNoteInCache } from './update-note-in-cache';
import { onBroadcastMessage } from '@/shared/lib/broadcast';

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

        queryClient.getQueriesData<InfiniteData<NoteShort[]>>({ queryKey: ['notes'], exact: false })
          .map(([queryKey, queryData]) => {
            queryClient.setQueryData(queryKey, updateNoteInCache(queryData, noteId, note => ({
              ...note,
              reminder_date: null,
            })));
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
  awaitI18n?: Promise<void>,
) => {
  await clearFiredReminders(dataTransfer, messagesDataTransfer, queryClient);

  listenForReminders(dataTransfer, messagesDataTransfer, queryClient);

  await registerPush().catch(async () => {
    if (awaitI18n) {
      await awaitI18n;
    }

    notifier.add({
      title: 'toasts.error.notifications.setupFailed',
      type: 'danger',
      message: 'toasts.error.actions.visitInfoPage',
    });
  });
};
