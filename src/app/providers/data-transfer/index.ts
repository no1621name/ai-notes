import type { App } from 'vue';
import { createDBDataTransfer, createMessagesDataTransfer, dbDataTransferKey, messagesDataTransferKey } from './db';
import { createLsDataTransfer, lsDataTransferKey } from './localstorage';
import { ErrorNotifier } from '@/shared/api/errors/error-notifier';

export const setupDataTransfers = (app: App) => {
  const errorNotifier = new ErrorNotifier();

  const dbDataTransfer = createDBDataTransfer(errorNotifier);
  const lsDataTransfer = createLsDataTransfer(errorNotifier);
  const messagesDataTransfer = createMessagesDataTransfer(errorNotifier);

  app.provide(dbDataTransferKey, dbDataTransfer);
  app.provide(lsDataTransferKey, lsDataTransfer);
  app.provide(messagesDataTransferKey, messagesDataTransfer);

  return {
    dbDataTransfer,
    messagesDataTransfer,
    lsDataTransfer,
    errorNotifier,
  };
};

export { useDbDataTransfer, useMessagesDataTransfer } from './db';
export { useLsDataTransfer } from './localstorage';
