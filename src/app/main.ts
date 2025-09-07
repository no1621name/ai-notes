import { createApp, type App as IApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './app.vue';
import router from './router';
import { createDataTransfer, dataTransferKey } from './providers/data-transfer';
import './styles/main.css';

const configureApp = (app: IApp) => {
  app.use(VueQueryPlugin);
  app.use(createPinia());
  app.use(router);

  const dataTransfer = createDataTransfer();

  app.provide(dataTransferKey, dataTransfer);
};

const app = createApp(App);
configureApp(app);

app.mount('#app');
