import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useToasterStore } from '@/app/stores/toaster';
import { ErrorNotifier } from './error-notifier';

const createNotifier = () => {
  const notifier = new ErrorNotifier();
  const toasterStore = useToasterStore();
  notifier.setNotifyFn((payload) => {
    toasterStore.add({
      type: payload.type,
      title: payload.title,
      message: payload.message,
    });
  });
  return { notifier, toasterStore };
};

describe('ErrorNotifier', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useToasterStore().showErrors();
  });

  describe('basic functional', () => {
    it('should add a custom toast payload', () => {
      const { notifier, toasterStore } = createNotifier();
      const customPayload = {
        type: 'success',
        title: 'Custom Title',
        message: 'Custom Message',
      } as const;

      notifier.add(customPayload);

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe(customPayload.type);
      expect(toast?.title).toBe(customPayload.title);
      expect(toast?.message).toBe(customPayload.message);
    });
  });

  describe('prepared errors', () => {
    it('should add a toast for invalidStoreName', () => {
      const { notifier, toasterStore } = createNotifier();

      notifier.invalidStoreName();

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.common.storeError');
      expect(toast?.message).toBe('toasts.error.store.invalidName');
    });

    it('should add a toast for missingPrimaryKey', () => {
      const { notifier, toasterStore } = createNotifier();

      notifier.missingPrimaryKey();

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.common.storeError');
      expect(toast?.message).toBe('toasts.error.store.missingPrimaryKey');
    });

    it('should add a toast for requestFailed without an error', () => {
      const { notifier, toasterStore } = createNotifier();

      notifier.requestFailed();

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.title');
      expect(toast?.message).toBe('toasts.error.common.requestFailed');
    });

    it('should add a toast for requestFailed with an error', () => {
      const { notifier, toasterStore } = createNotifier();
      const error = new DOMException('Permission denied');

      notifier.requestFailed(error);

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.title');
    });

    it('should add a toast for duplicateItem', () => {
      const { notifier, toasterStore } = createNotifier();

      notifier.duplicateItem('123', 'notes');

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.item.duplicateTitle');
    });

    it('should add a toast for itemNotFound', () => {
      const { notifier, toasterStore } = createNotifier();

      notifier.itemNotFound('456', 'tags');

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.item.notFoundTitle');
    });

    it('should add a toast for missingIdForUpdate', () => {
      const { notifier, toasterStore } = createNotifier();

      notifier.missingIdForUpdate();

      expect(toasterStore.toasts).toHaveLength(1);
      const toast = toasterStore.toasts[0];
      expect(toast?.type).toBe('danger');
      expect(toast?.title).toBe('toasts.error.item.invalid');
    });
  });
});
