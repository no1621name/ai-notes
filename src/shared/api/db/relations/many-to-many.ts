import type { DataStore, PrimaryKeyType } from '@/shared/types/api';
import type { DBDataTransfer } from '../client';

export interface ManyToManyRelationConfig {
  relationStore: DataStore;
  sourceForeignKey: string;
  relatedForeignKey: string;
  sourceStore: DataStore;
  relatedStore: DataStore;
  relatedField: string;
}

export class ManyToManyManager {
  private relationStore: DataStore;
  private sourceForeignKey: string;
  private relatedForeignKey: string;
  private sourceStore: DataStore;
  private relatedStore: DataStore;
  private relatedField: string;

  constructor(
    config: ManyToManyRelationConfig,
    private dataTransfer: DBDataTransfer,
  ) {
    this.relationStore = config.relationStore;
    this.sourceForeignKey = config.sourceForeignKey;
    this.relatedForeignKey = config.relatedForeignKey;
    this.sourceStore = config.sourceStore;
    this.relatedStore = config.relatedStore;
    this.relatedField = config.relatedField;
  }

  private getStores() {
    return this.dataTransfer.getStores([
      this.sourceStore.name,
      this.relationStore.name,
      this.relatedStore.name,
    ]);
  }

  public async get<
    S extends { id: PrimaryKeyType },
    R extends { id: PrimaryKeyType },
    K extends string,
  >(sourceId: PrimaryKeyType): Promise<S & { [key in K]: R[] }> {
    const [sourceObjectStore, relationObjectStore, relatedObjectStore] = await this.getStores();

    const sourceEntity = await new Promise<S>((resolve, reject) => {
      const request = sourceObjectStore.get(sourceId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!sourceEntity) {
      throw new Error(`Entity with id ${sourceId} not found in ${this.sourceStore.name}`);
    }

    const relationIndex = relationObjectStore.index(this.relationStore.indexes![this.sourceForeignKey].name);

    const relatedIds = await new Promise<PrimaryKeyType[]>((resolve, reject) => {
      const request = relationIndex.getAll(sourceId);
      request.onsuccess = () =>
        resolve(request.result.map(relation => relation[this.relatedForeignKey]));
      request.onerror = () => reject(request.error);
    });

    const relatedEntities: R[] = await Promise.all(
      relatedIds.map(
        id =>
          new Promise<R>((resolve, reject) => {
            const request = relatedObjectStore.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          }),
      ),
    );

    return {
      ...sourceEntity,
      [this.relatedField]: relatedEntities,
    } as S & { [key in K]: R[] };
  }

  public async getAll<
    S extends { id: PrimaryKeyType },
    R extends { id: PrimaryKeyType },
    K extends string,
  >(): Promise<(S & { [key in K]: R[] })[]> {
    const [sourceObjectStore, relationObjectStore, relatedObjectStore] = await this.getStores();

    const sourceEntities = await new Promise<S[]>((resolve, reject) => {
      const request = sourceObjectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const sourceMap = new Map(sourceEntities.map(entity => [entity.id, entity]));

    const sourceToRelatedMap = await new Promise<Map<PrimaryKeyType, PrimaryKeyType[]>>(
      (resolve, reject) => {
        const relationIndex = relationObjectStore.index(
          this.relationStore.indexes![this.sourceForeignKey].name,
        );
        const request = relationIndex.openCursor();
        const relationsMap = new Map<PrimaryKeyType, PrimaryKeyType[]>();

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            const relation = cursor.value;
            const sourceId = relation[this.sourceForeignKey];
            const relatedId = relation[this.relatedForeignKey];
            if (!relationsMap.has(sourceId)) {
              relationsMap.set(sourceId, []);
            }
            relationsMap.get(sourceId)!.push(relatedId);
            cursor.continue();
          } else {
            resolve(relationsMap);
          }
        };
        request.onerror = () => reject(request.error);
      },
    );

    const allRelatedIds = new Set(Array.from(sourceToRelatedMap.values()).flat());
    if (!allRelatedIds.size) {
      return Array.from(sourceMap.values()).map(entity => ({
        ...entity,
        [this.relatedField]: [],
      })) as (S & { [key in K]: R[] })[];
    }

    const relatedEntities = await new Promise<R[]>((resolve, reject) => {
      const request = relatedObjectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const relatedMap = new Map(relatedEntities.map(entity => [entity.id, entity]));

    return Array.from(sourceMap.values()).map((entity) => {
      const relatedIds = sourceToRelatedMap.get(entity.id) || [];
      const populatedRelated = relatedIds
        .map(id => relatedMap.get(id))
        .filter((related): related is R => typeof related !== 'undefined');

      return {
        ...entity,
        [this.relatedField]: populatedRelated,
      };
    }) as (S & { [key in K]: R[] })[];
  }

  public addRelation(sourceId: PrimaryKeyType, relatedId: PrimaryKeyType): Promise<PrimaryKeyType> {
    const relationRecord: Record<string, PrimaryKeyType> = {
      [this.sourceForeignKey]: sourceId,
      [this.relatedForeignKey]: relatedId,
    };

    return this.dataTransfer.create(this.relationStore.name, relationRecord);
  }

  public async deleteRelation(sourceId: PrimaryKeyType, relatedId: PrimaryKeyType): Promise<void> {
    const [, relationObjectStore] = await this.getStores();

    const sourceIndex = relationObjectStore.index(this.relationStore.indexes![this.sourceForeignKey].name);

    await new Promise<void>((resolve, reject) => {
      const request = sourceIndex.openCursor(IDBKeyRange.only(sourceId));

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const relation = cursor.value;
          if (relation[this.relatedForeignKey] === relatedId) {
            const deleteRequest = cursor.delete();
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
            return;
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteRelationsBySourceId(sourceId: PrimaryKeyType): Promise<void> {
    const [, relationObjectStore] = await this.getStores();

    const sourceIndex = relationObjectStore.index(this.relationStore.indexes![this.sourceForeignKey].name);

    await new Promise<void>((resolve, reject) => {
      const request = sourceIndex.openCursor(IDBKeyRange.only(sourceId));

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  public async deleteRelationsByRelatedId(relatedId: PrimaryKeyType): Promise<void> {
    const [, relationObjectStore] = await this.getStores();

    const relatedIndex = relationObjectStore.index(this.relationStore.indexes![this.relatedForeignKey].name);

    await new Promise<void>((resolve, reject) => {
      const request = relatedIndex.openCursor(IDBKeyRange.only(relatedId));

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}
