import { createApp, type App as IApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

import App from './app.vue';
import router from './router';
import { createDBDataTransfer, dbDataTransferKey, createLsDataTransfer, lsDataTransferKey } from './providers/data-transfer';
import { clickOutsideDirective } from '@/shared/lib/vue/click-outside-directive';
import { broadcastQueryClient } from '@/shared/lib/tanstack-query/broadcast';
import { ErrorNotifier } from '@/shared/api/errors/error-notifier';
import './styles/main.css';

const setupQuery = (app: IApp) => {
  const queryClient = new QueryClient();

  broadcastQueryClient(queryClient);

  app.use(VueQueryPlugin, { queryClient });
};

const configureApp = (app: IApp) => {
  setupQuery(app);
  app.use(createPinia());
  app.use(router);

  app.directive('click-outside', clickOutsideDirective);

  const errorNotifier = new ErrorNotifier();

  const dbDataTransfer = createDBDataTransfer(errorNotifier);
  const lsDataTransfer = createLsDataTransfer(errorNotifier);

  app.provide(dbDataTransferKey, dbDataTransfer);
  app.provide(lsDataTransferKey, lsDataTransfer);
};

const app = createApp(App);
configureApp(app);

app.mount('#app');
