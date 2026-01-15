import { sendBroadcastMessage } from '@/shared/lib/broadcast';
import { BROADCAST_EVENT } from './constants';

const LOCALE_STORAGE_KEY = 'locale';

export const getStoredLocale = () => localStorage.getItem(LOCALE_STORAGE_KEY) || 'en';
export const setStoredLocale = (locale: string) => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  sendBroadcastMessage(BROADCAST_EVENT, locale);
};
