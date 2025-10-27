import type { DataTransfer, PrimaryKeyType } from '@/shared/types/api';

interface StoredItem<T> {
  id: PrimaryKeyType;
  data: T;
}

export default class LocalStorageClient implements DataTransfer {
  private prefix: string;
  private idField: string;

  constructor(prefix: string = 'app', idField: string = 'id') {
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
    } catch (error) {
      console.error(`Error reading store ${store}:`, error);
      return [];
    }
  }

  private setStoreData<T>(store: string, data: StoredItem<T>[]): void {
    try {
      const key = this.getStoreKey(store);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to store ${store}:`, error);
      throw new Error(`Failed to save data to store ${store}`);
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
    return item?.data;
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
      throw new Error(`Item with id ${id} already exists in store ${store}`);
    }

    items.push({ id, data: item });
    this.setStoreData(store, items);

    return id;
  }

  async update<T>(store: string, item: T): Promise<PrimaryKeyType> {
    const items = this.getStoreData<T>(store);
    const id = this.extractId(item);

    if (!id) {
      throw new Error('Item must have an id field to be updated');
    }

    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found in store ${store}`);
    }

    items[index] = { id, data: item };
    this.setStoreData(store, items);

    return id;
  }

  async delete(store: string, id: PrimaryKeyType): Promise<void> {
    const items = this.getStoreData(store);
    const filteredItems = items.filter(i => i.id !== id);

    if (items.length === filteredItems.length) {
      throw new Error(`Item with id ${id} not found in store ${store}`);
    }

    this.setStoreData(store, filteredItems);
  }
}
