import { useToasterStore, type Toast } from '@/app/stores/toaster';
import { i18n } from '@/app/providers/i18n';

type AddToastPayload = Omit<Toast, 'id' | 'title' | 'message'> & {
  title: string;
  message?: string;
  titleParams?: Record<string, unknown>;
  messageParams?: Record<string, unknown>;
};

export const addToast = (payload: AddToastPayload, removeSeconds?: number) => {
  const { title, message, titleParams, messageParams, ...rest } = payload;

  useToasterStore().add({
    ...rest,
    title: i18n.global.t(title, titleParams ?? {}),
    message: message ? i18n.global.t(message, messageParams ?? {}) : undefined,
  }, removeSeconds);
};

export const removeToast = (id: Toast['id']) => useToasterStore().remove(id);

export { default as Toaster } from './ui.vue';
