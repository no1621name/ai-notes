import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useToasterStore } from '@/app/stores/toaster';
import { ErrorNotifier } from './error-notifier';

describe('ErrorNotifier', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should add a toast for invalidStoreName', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();

    notifier.invalidStoreName();

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Store error occurred');
    expect(toast.message).toBe('Invalid store name');
  });

  it('should add a toast for missingPrimaryKey', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();

    notifier.missingPrimaryKey();

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Store error occurred');
    expect(toast.message).toBe('Missing primary key');
  });

  it('should add a toast for requestFailed without an error', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();

    notifier.requestFailed();

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Request error occurred');
    expect(toast.message).toBe('Request failed');
  });

  it('should add a toast for requestFailed with an error', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();
    const error = new DOMException('Permission denied');

    notifier.requestFailed(error);

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Request error occurred');
  });

  it('should add a toast for duplicateItem', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();

    notifier.duplicateItem('123', 'notes');

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Duplicate item');
  });

  it('should add a toast for itemNotFound', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();

    notifier.itemNotFound('456', 'tags');

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Item not found');
  });

  it('should add a toast for missingIdForUpdate', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();

    notifier.missingIdForUpdate();

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('danger');
    expect(toast.title).toBe('Invalid item');
  });

  it('should add a custom toast payload', () => {
    const notifier = new ErrorNotifier();
    const toasterStore = useToasterStore();
    const customPayload = {
      type: 'success',
      title: 'Custom Title',
      message: 'Custom Message',
    } as const;

    notifier.add(customPayload);

    expect(toasterStore.toasts).toHaveLength(1);
    const toast = toasterStore.toasts[0];
    expect(toast.type).toBe('success');
    expect(toast.title).toBe('Custom Title');
    expect(toast.message).toBe('Custom Message');
  });
});
