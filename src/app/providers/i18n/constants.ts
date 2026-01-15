import type { DefaultDateTimeFormatSchema } from 'vue-i18n';
import type { AvailableLocale } from './types';

export const defaultDateTimeFormat: DefaultDateTimeFormatSchema = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
};

export const AVAILABLE_LOCALES: AvailableLocale[] = ['en', 'ru'];
export const LANGUAGE_NAMES: Record<AvailableLocale, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
};

export const BROADCAST_EVENT = 'i18n:locale-changed';
