import type { DefaultDateTimeFormatSchema, I18n } from 'vue-i18n';

export type AvailableLocale = 'en' | 'ru';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type I18nInstance = I18n<{}, Record<AvailableLocale, DefaultDateTimeFormatSchema>, {}, AvailableLocale, false>;
