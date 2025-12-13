import { useToasterStore, type Toast } from '@/app/stores/toaster';

export const addToast = (payload: Omit<Toast, 'id'>, removeSeconds?: number) =>
  useToasterStore().add(payload, removeSeconds);
export const removeToast = (id: Toast['id']) => useToasterStore().remove(id);

export { default as Toaster } from './ui.vue';
