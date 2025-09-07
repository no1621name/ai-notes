import { useToasterStore, type Toast } from '@/app/stores/toaster';

export const addNotification = (payload: Omit<Toast, 'id'>, removeSeconds?: number) =>
  useToasterStore().add(payload, removeSeconds);
export const removeNotification = (id: Toast['id']) => useToasterStore().remove(id);
