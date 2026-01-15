import { nextTick, type App } from 'vue';
import { createI18n } from 'vue-i18n';
import { defaultDateTimeFormat, AVAILABLE_LOCALES } from './constants';
import type { AvailableLocale, I18nInstance } from './types';
import { getStoredLocale, setStoredLocale } from './state';

export const isAvailableLocale = (locale: string): locale is AvailableLocale => AVAILABLE_LOCALES.includes(locale as AvailableLocale);

export const setI18nLanguage = (i18n: I18nInstance, locale: AvailableLocale) => {
  setStoredLocale(locale);

  i18n.global.locale.value = locale;
  document.querySelector('html')?.setAttribute('lang', locale);
};

export const getLocale = (i18n: I18nInstance): string => {
  return typeof i18n.global.locale === 'string' ? i18n.global.locale : i18n.global.locale.value;
};

export const loadLocaleMessages = async (i18n: I18nInstance, locale: AvailableLocale) => {
  const messages = await import(`./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
};

export const setupI18n = (app: App) => {
  const i18n = createI18n({
    legacy: false,
    locale: getStoredLocale(),
    availableLocales: AVAILABLE_LOCALES,
    fallbackLocale: 'en',
    datetimeFormats: {
      en: defaultDateTimeFormat,
      ru: defaultDateTimeFormat,
    },
  });

  app.use(i18n);
  return i18n;
};
