import { addToast } from '@/app/providers/toasts';
import { type ToastType } from '@/app/stores/toaster';

type ToastPayload = {
  type: ToastType;
  title: string;
  message: string;
};

export class ErrorNotifier {
  public invalidStoreName() {
    this.add({
      type: 'danger',
      title: 'Store error occurred',
      message: 'Invalid store name',
    });
  }

  public missingPrimaryKey() {
    this.add({
      type: 'danger',
      title: 'Store error occurred',
      message: 'Missing primary key',
    });
  }

  public requestFailed(error?: DOMException | null) {
    this.add({
      type: 'danger',
      title: 'Request error occurred',
      message: `Request failed${error ? `: ${error.message}` : ''}`,
    });
  }

  public duplicateItem(id: string | number, store: string) {
    this.add({
      type: 'danger',
      title: 'Duplicate item',
      message: `Item with id "${id}" already exists in store "${store}"`,
    });
  }

  public itemNotFound(id: string | number, store: string) {
    this.add({
      type: 'danger',
      title: 'Item not found',
      message: `Item with id "${id}" not found in store "${store}"`,
    });
  }

  public missingIdForUpdate() {
    this.add({
      type: 'danger',
      title: 'Invalid item',
      message: 'Item must have an id field to be updated',
    });
  }

  public add(payload: ToastPayload) {
    addToast(payload);
  }
}
