import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';
import type { ErrorNotifier } from '@/shared/api/errors/error-notifier';

interface StoredItem<T> {
  id: PrimaryKeyType;
  data: T;
}

export default class LocalStorageClient implements DataTransfer {
  private prefix: string;
  private idField: string;

  constructor(private notifier: ErrorNotifier, prefix: string = 'app', idField: string = 'id') {
    this.prefix = prefix;
    this.idField = idField;
  }

  private getStoreKey(store: string): string {
    return `${this.prefix}:${store}`;
  }

  private getStoreData<T>(store: string): StoredItem<T>[] {
    try {
      const key = this.getStoreKey(store);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      const message = `Failed to read data from store "${store}"`;
      this.notifier.add({
        type: 'danger',
        title: 'Storage read error',
        message,
      });
      throw new Error(message);
    }
  }

  private setStoreData<T>(store: string, data: StoredItem<T>[]): void {
    try {
      const key = this.getStoreKey(store);
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      const message = `Failed to save data to store "${store}"`;
      this.notifier.add({
        type: 'danger',
        title: 'Storage write error',
        message,
      });
      throw new Error(message);
    }
  }

  private extractId(item: unknown): PrimaryKeyType | undefined {
    if (typeof item === 'object' && item !== null && this.idField in item) {
      return (item as Record<string, unknown>)[this.idField] as PrimaryKeyType;
    }
    return undefined;
  }

  private generateId(): PrimaryKeyType {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getById<T>(store: string, id: PrimaryKeyType): Promise<T | undefined> {
    const items = this.getStoreData<T>(store);
    const item = items.find(i => i.id === id);

    if (typeof item?.data === 'undefined') {
      this.notifier.itemNotFound(id, store);
      throw new Error(`Item with id "${id}" not found in store "${store}"`);
    }

    return item.data;
  }

  async getAll<T>(store: string): Promise<T[]> {
    const items = this.getStoreData<T>(store);
    return items.map(i => i.data);
  }

  async create<T>(store: string, item: T): Promise<PrimaryKeyType> {
    const items = this.getStoreData<T>(store);

    let id = this.extractId(item);
    if (!id) {
      id = this.generateId();
      (item as Record<string, unknown>)[this.idField] = id;
    }

    const existingIndex = items.findIndex(i => i.id === id);
    if (existingIndex !== -1) {
      this.notifier.duplicateItem(id, store);
      throw new Error(`Item with id ${id} already exists in store ${store}`);
    }

    items.push({ id, data: item });
    this.setStoreData(store, items);

    return id;
  }

  async update<T>(store: string, item: Partial<T>): Promise<T> {
    const id = this.extractId(item);

    if (!id) {
      this.notifier.missingIdForUpdate();
      throw new Error('Item must have an id field to be updated');
    }

    const items = this.getStoreData<T>(store);
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
      this.notifier.itemNotFound(id, store);
      throw new Error(`Item with id ${id} not found in store ${store}`);
    }

    const newItem = { ...items[index].data, ...item } as T;
    items[index] = { id, data: newItem };
    this.setStoreData(store, items);

    return newItem;
  }

  async delete(store: string, id: PrimaryKeyType): Promise<void> {
    const items = this.getStoreData(store);
    const filteredItems = items.filter(i => i.id !== id);

    if (items.length === filteredItems.length) {
      this.notifier.itemNotFound(id, store);
      throw new Error(`Item with id ${id} not found in store ${store}`);
    }

    this.setStoreData(store, filteredItems);
  }
}
