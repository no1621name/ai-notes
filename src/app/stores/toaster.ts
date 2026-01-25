import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type ToastType = 'default' | 'success' | 'danger';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

export const PERSISTED_ERRORS_SHOWN_KEY = 'errorsShown';

export const useToasterStore = defineStore('toaster', () => {
  const errorsShown = ref<boolean>(false);
  const value = localStorage.getItem(PERSISTED_ERRORS_SHOWN_KEY);
  if (value !== null) {
    errorsShown.value = value === 'true';
  }

  watch(errorsShown, (value, prev) => {
    if (value === prev) return;
    localStorage.setItem(PERSISTED_ERRORS_SHOWN_KEY, value.toString());
  });

  const toasts = ref<Toast[]>([]);
  let id: Toast['id'] = 0;
  const timers = new Map<Toast['id'], ReturnType<typeof setTimeout>>();

  const remove = (id: Toast['id']) => {
    const index = toasts.value.findIndex(toast => toast.id === id);

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

    if (!errorsShown.value && toast.type === 'danger') {
      return toast.id;
    }

    toasts.value.push(toast);

    if (removeSeconds > 0) {
      const tid = setTimeout(() => remove(toast.id), removeSeconds * 1000);
      timers.set(toast.id, tid);
    }

    return toast.id;
  };

  const hideErrors = () => {
    errorsShown.value = false;
  };

  const showErrors = () => {
    errorsShown.value = true;
  };

  return {
    toasts,
    add,
    remove,
    errorsShown,
    hideErrors,
    showErrors,
  };
});
