import { createApp, type App as IApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { RegleVuePlugin } from '@regle/core';

import App from './app.vue';
import router from './router';
import { setupReminders } from '@/entities/note';
import {
  createDBDataTransfer,
  dbDataTransferKey,
  createLsDataTransfer,
  lsDataTransferKey,
  createMessagesDataTransfer,
  messagesDataTransferKey,
} from './providers/data-transfer';
import { clickOutsideDirective } from '@/shared/lib/vue/click-outside-directive';
import { broadcastQueryClient } from '@/shared/lib/tanstack-query/broadcast';
import { ErrorNotifier } from '@/shared/api/errors/error-notifier';
import './styles/main.css';

const setupQuery = (app: IApp) => {
  const queryClient = new QueryClient();

  broadcastQueryClient(queryClient);

  app.use(VueQueryPlugin, { queryClient });

  return queryClient;
};

const configureApp = async (app: IApp) => {
  const queryClient = setupQuery(app);
  app.use(createPinia());
  app.use(router);
  app.use(RegleVuePlugin);

  app.directive('click-outside', clickOutsideDirective);

  const errorNotifier = new ErrorNotifier();

  const dbDataTransfer = createDBDataTransfer(errorNotifier);
  const lsDataTransfer = createLsDataTransfer(errorNotifier);
  const messagesDataTransfer = createMessagesDataTransfer(errorNotifier);

  app.provide(dbDataTransferKey, dbDataTransfer);
  app.provide(lsDataTransferKey, lsDataTransfer);
  app.provide(messagesDataTransferKey, messagesDataTransfer);

  await setupReminders(dbDataTransfer, messagesDataTransfer, errorNotifier, queryClient);
};

const app = createApp(App);
configureApp(app);

app.mount('#app');
