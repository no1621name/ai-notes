import anchorPolyfill from '@oddbird/css-anchor-positioning/fn';

await anchorPolyfill();

import { createApp, type App as IApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './app.vue';
import router from './router';
import { createDBDataTransfer, dbDataTransferKey, createLsDataTransfer, lsDataTransferKey } from './providers/data-transfer';
import { ErrorNotifier } from '@/shared/api/errors/error-notifier';
import './styles/main.css';

const configureApp = (app: IApp) => {
  app.use(VueQueryPlugin);
  app.use(createPinia());
  app.use(router);

  const errorNotifier = new ErrorNotifier();

  const dbDataTransfer = createDBDataTransfer(errorNotifier);
  const lsDataTransfer = createLsDataTransfer(errorNotifier);

  app.provide(dbDataTransferKey, dbDataTransfer);
  app.provide(lsDataTransferKey, lsDataTransfer);
};

const app = createApp(App);
configureApp(app);

app.mount('#app');
