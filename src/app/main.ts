import { createApp, type App as IApp } from 'vue';
import { createPinia } from 'pinia';
import { RegleVuePlugin } from '@regle/core';

import App from './app.vue';
import { setupRouter } from './router';
import { setupI18n, getLocale, isAvailableLocale, loadLocaleMessages } from './providers/i18n';
import { setupQuery } from './providers/tanstack-query';
import { setupDataTransfers } from './providers/data-transfer';
import { setupReminders } from '@/entities/note';
import { clickOutsideDirective } from '@/shared/lib/vue/click-outside-directive';

import './styles/main.css';

const configureApp = async (app: IApp) => {
  const i18n = setupI18n(app);
  const locale = getLocale(i18n);
  const i18nLoadingPromise = isAvailableLocale(locale)
    ? loadLocaleMessages(i18n, locale)
    : Promise.resolve();

  const router = setupRouter(i18n);
  app.use(router);

  app.use(createPinia());
  app.use(RegleVuePlugin);

  app.directive('click-outside', clickOutsideDirective);

  const queryClient = setupQuery(app);
  const {
    dbDataTransfer,
    messagesDataTransfer,
    errorNotifier,
  } = setupDataTransfers(app);

  await setupReminders(dbDataTransfer, messagesDataTransfer, errorNotifier, queryClient, i18nLoadingPromise);
};

const app = createApp(App);
configureApp(app);

app.mount('#app');
