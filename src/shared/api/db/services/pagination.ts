import { toText } from '@/shared/lib/tiptap/to-text';
import type { DBDataTransfer } from '../client';
import type { DataStore, PrimaryKeyType } from '@/shared/types/api';

interface PageOptions {
  page: number;
  pageSize: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
  search?: {
    text: string;
    fields: string[];
  };
  allowedIds?: PrimaryKeyType[];
}

export default class PaginationService {
  constructor(
    private config: DataStore,
    private db: DBDataTransfer,
  ) {}

  private validateFieldValue(value: unknown): value is string {
    return typeof value === 'string';
  }

  private valueHasField(value: unknown, key: string): key is keyof typeof value {
    return typeof value === 'object' && value !== null && key in value;
  }

  private matchesSearch(value: unknown, query: string): boolean {
    let fieldValue = value;

    if (this.validateFieldValue(fieldValue) && fieldValue.match(/[:,\{\}\[\]]|(\".*?\")|('.*?')|[-\w.]+/g)?.length) {
      try {
        fieldValue = toText(JSON.parse(fieldValue));
      } catch { }
    }

    if (!this.validateFieldValue(fieldValue)) {
      return false;
    }

    return fieldValue.toLowerCase().includes(query.toLowerCase());
  }

  public async getPage<T>(storeName: string,
    {
      page,
      pageSize,
      order = 'desc',
      orderBy = 'created_at',
      search,
      allowedIds,
    }: PageOptions,
  ): Promise<T[]> {
    const [store] = await this.db.getStores([storeName]);

    if (!store) {
      throw new Error(`Store ${storeName} not found`);
    }

    let source: IDBObjectStore | IDBIndex = store;

    if (orderBy !== this.config.primaryKey) {
      const indexConfig = this.config.indexes?.[orderBy];
      if (!indexConfig) {
        throw new Error(`Store ${storeName} has no index for field ${orderBy}`);
      }
      source = store.index(indexConfig.keyPath);
    }

    const allowedIdsSet = allowedIds ? new Set(allowedIds) : null;

    return new Promise((resolve, reject) => {
      const result: T[] = [];
      const direction = order === 'desc' ? 'prev' : 'next';
      const request = source.openCursor(null, direction);
      let skipped = 0;
      const skipCount = (page - 1) * pageSize;
      const getAll = pageSize < 0;

      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          resolve(result);
          return;
        }

        const value = cursor.value as T;
        const id = (value as Record<string, unknown>)[this.config.primaryKey] as PrimaryKeyType;

        if (allowedIdsSet && !allowedIdsSet.has(id)) {
          cursor.continue();
          return;
        }

        const matchesSearch = !search
          || search.fields.some(field =>
            this.valueHasField(value, field) && this.matchesSearch(value[field], search.text),
          );

        if (matchesSearch) {
          if (skipped < skipCount) {
            skipped++;
            cursor.continue();
            return;
          }

          if (getAll || result.length < pageSize) {
            result.push(value);
            cursor.continue();
          } else {
            resolve(result);
          }
        } else {
          cursor.continue();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}
