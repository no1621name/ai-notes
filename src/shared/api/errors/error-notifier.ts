import { addToast } from '@/app/providers/toasts';
import { type ToastType } from '@/app/stores/toaster';

type ToastPayload = {
  type: ToastType;
  title: string;
  message: string;
  titleParams?: Record<string, unknown>;
  messageParams?: Record<string, unknown>;
};

export class ErrorNotifier {
  public invalidStoreName() {
    this.add({
      type: 'danger',
      title: 'toasts.error.common.storeError',
      message: 'toasts.error.store.invalidName',
    });
  }

  public missingPrimaryKey() {
    this.add({
      type: 'danger',
      title: 'toasts.error.common.storeError',
      message: 'toasts.error.store.missingPrimaryKey',
    });
  }

  public requestFailed(error?: DOMException | null) {
    this.add({
      type: 'danger',
      title: 'toasts.error.title',
      message: error ? 'toasts.error.common.requestFailedWithMessage' : 'toasts.error.common.requestFailed',
      messageParams: error ? { message: error.message } : undefined,
    });
  }

  public duplicateItem(id: string | number, store: string) {
    this.add({
      type: 'danger',
      title: 'toasts.error.item.duplicateTitle',
      message: 'toasts.error.item.duplicateMessage',
      messageParams: { id, store },
    });
  }

  public itemNotFound(id: string | number, store: string) {
    this.add({
      type: 'danger',
      title: 'toasts.error.item.notFoundTitle',
      message: 'toasts.error.item.notFoundMessage',
      messageParams: { id, store },
    });
  }

  public missingIdForUpdate() {
    this.add({
      type: 'danger',
      title: 'toasts.error.item.invalid',
      message: 'toasts.error.item.missingIdForUpdate',
    });
  }

  public add(payload: ToastPayload) {
    addToast(payload);
  }
}
