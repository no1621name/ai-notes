import type { NavigationGuard } from 'vue-router';
import Home from '@/pages/home.vue';
import { isAvailableLocale, loadLocaleMessages, setI18nLanguage, type I18nInstance } from '../providers/i18n';

export const drawerDefaultComponentGuard = (depth: number = 0): NavigationGuard => (to, from) => {
  const toRecord = to.matched[depth];
  const toComponents = toRecord?.components;

  if (!toComponents) {
    return;
  }

  if (from.matched.length === depth + 1) {
    const fromRecord = from.matched[depth];
    const fromComponents = fromRecord?.components;
    const fromDefault = fromComponents?.default;

    if (fromDefault) {
      toComponents.default = fromDefault;
    } else {
      toComponents.default = Home;
    }
  } else {
    toComponents.default = Home;
  }
};

export const i18nGuard = (i18n: I18nInstance, locale: string): NavigationGuard => async (to, from, next) => {
  const paramsLocale = Array.isArray(to.params.locale) ? to.params.locale[0] : to.params.locale;
  if (!paramsLocale) {
    return next('/en');
  }

  if (!isAvailableLocale(paramsLocale)) {
    return next(`/${locale}`);
  }

  await loadLocaleMessages(i18n, paramsLocale);
  setI18nLanguage(i18n, paramsLocale);

  return next();
};
