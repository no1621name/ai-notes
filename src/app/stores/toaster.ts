import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'default' | 'success' | 'danger';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

export const useToasterStore = defineStore('toaster', () => {
  const toasts = ref<Toast[]>([]);
  let id: Toast['id'] = 0;
  const timers = new Map<Toast['id'], NodeJS.Timeout>();

  const remove = (id: Toast['id']) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);

    if (index >= 0) {
      toasts.value.splice(index, 1);
    }

    const tid = timers.get(id);
    if (tid) {
      clearTimeout(tid);
      timers.delete(id);
    }
  };

  const add = (payload: Omit<Toast, 'id'>, removeSeconds = 5): Toast['id'] => {
    const toast: Toast = { id: ++id, ...payload };
    toasts.value.push(toast);

    if (removeSeconds > 0) {
      const tid = setTimeout(() => remove(toast.id), removeSeconds * 1000);
      timers.set(toast.id, tid);
    }

    return toast.id;
  };

  return {
    toasts,
    add,
    remove,
  };
});
