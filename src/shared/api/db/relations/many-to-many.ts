import type { DBDataTransfer } from '../client';
import type { DataStore, PrimaryKeyType } from '@/shared/types/api';
import { promisifyCursor, promisifyRequest } from '@/shared/lib/idb/promisify';
import type { Tuple } from '@/shared/types/utils';

export interface ManyToManyRelationConfig {
  relationStore: DataStore;
  sourceForeignKey: string;
  relatedForeignKey: string;
  sourceStore: DataStore;
  relatedStore: DataStore;
  relatedField: string;
}

interface MinimalEntity {
  id: PrimaryKeyType;
}

export class ManyToManyManager {
  private relationStore: DataStore;
  private sourceForeignKey: string;
  private relatedForeignKey: string;
  private sourceStore: DataStore;
  private relatedStore: DataStore;
  private relatedField: string;

  private readonly sourceIndexName: string;
  private readonly relatedIndexName: string;

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

    if (!config.relationStore.indexes?.[config.sourceForeignKey]) {
      throw new Error(
        `Index for sourceForeignKey "${config.sourceForeignKey}" not found in relationStore "${config.relationStore.name}"`,
      );
    }
    this.sourceIndexName = config.relationStore.indexes[config.sourceForeignKey]!.name;

    if (!config.relationStore.indexes?.[config.relatedForeignKey]) {
      throw new Error(
        `Index for relatedForeignKey "${config.relatedForeignKey}" not found in relationStore "${config.relationStore.name}"`,
      );
    }
    this.relatedIndexName = config.relationStore.indexes[config.relatedForeignKey]!.name;
  }

  private getStores() {
    return this.dataTransfer.getStores([
      this.sourceStore.name,
      this.relationStore.name,
      this.relatedStore.name,
    ]) as Promise<Tuple<IDBObjectStore, 3>>;
  }

  public async get<
    S extends MinimalEntity,
    R extends MinimalEntity,
    K extends string,
  >(sourceId: PrimaryKeyType): Promise<S & { [key in K]: R[] }> {
    const [sourceStore, relationStore, relatedStore] = await this.getStores();

    const sourceEntity = await promisifyRequest<S>(sourceStore.get(sourceId));

    if (!sourceEntity) {
      throw new Error(`Entity with id ${sourceId} not found in ${this.sourceStore.name}`);
    }

    const relationIndex = relationStore.index(this.sourceIndexName);
    const relations = await promisifyRequest<Record<string, PrimaryKeyType>[]>(relationIndex.getAll(IDBKeyRange.only(sourceId)));
    const relatedIds = relations.map(r => r[this.relatedForeignKey]).filter((id): id is PrimaryKeyType => id !== undefined);

    const relatedEntities = await Promise.all(
      relatedIds.map(id => promisifyRequest<R>(relatedStore.get(id))),
    );

    return {
      ...sourceEntity,
      [this.relatedField]: relatedEntities.filter(Boolean),
    } as S & { [key in K]: R[] };
  }

  public async getAll<
    S extends MinimalEntity,
    R extends MinimalEntity,
    K extends string,
  >(): Promise<(S & { [key in K]: R[] })[]> {
    const [sourceObjectStore, relationObjectStore, relatedObjectStore] = await this.getStores();

    const sourceEntities = await promisifyRequest<S[]>(sourceObjectStore.getAll());

    const sourceToRelateMap = await this.buildSourceToRelatedMap(relationObjectStore);
    const relatedMap = await this.buildRelatedMap<R>(relatedObjectStore);

    return this.attachRelations<S, R, K>(sourceEntities, sourceToRelateMap, relatedMap);
  }

  public async populateRelations<
    S extends MinimalEntity,
    R extends MinimalEntity,
    K extends string,
  >(entities: S[]): Promise<(S & { [key in K]: R[] })[]> {
    const [, relationObjectStore, relatedObjectStore] = await this.getStores();
    const sourceIds = new Set(entities.map(entity => entity.id));

    const sourceToRelateMap = await this.buildSourceToRelatedMap(relationObjectStore, sourceIds);
    const relatedMap = await this.buildRelatedMap<R>(relatedObjectStore);

    return this.attachRelations<S, R, K>(entities, sourceToRelateMap, relatedMap);
  }

  public addRelation(sourceId: PrimaryKeyType, relatedId: PrimaryKeyType): Promise<PrimaryKeyType> {
    const relationRecord: Record<string, PrimaryKeyType> = {
      [this.sourceForeignKey]: sourceId,
      [this.relatedForeignKey]: relatedId,
    };

    return this.dataTransfer.create(this.relationStore.name, relationRecord);
  }

  public async deleteRelation(sourceId: PrimaryKeyType, relatedId: PrimaryKeyType) {
    const [, relationStore] = await this.getStores();

    const index = relationStore.index(this.sourceIndexName);

    return promisifyCursor(
      index.openCursor(IDBKeyRange.only(sourceId)),
      (cursor) => {
        const value = cursor.value;
        if (value[this.relatedForeignKey] === relatedId) {
          cursor.delete();
        }
      },
    );
  }

  public async deleteRelationsBySourceId(sourceId: PrimaryKeyType): Promise<void> {
    const [, relationStore] = await this.getStores();

    const index = relationStore.index(this.sourceIndexName);

    return promisifyCursor(
      index.openCursor(IDBKeyRange.only(sourceId)),
      (cursor) => {
        cursor.delete();
      },
    );
  }

  public async deleteRelationsByRelatedId(relatedId: PrimaryKeyType): Promise<void> {
    const [, relationStore] = await this.getStores();

    const index = relationStore.index(this.relatedIndexName);

    return promisifyCursor(
      index.openCursor(IDBKeyRange.only(relatedId)),
      (cursor) => {
        cursor.delete();
      },
    );
  }

  public async findSourceIdsByRelatedIds(relatedIds: PrimaryKeyType[]): Promise<PrimaryKeyType[]> {
    const [, relationStore] = await this.getStores();
    const index = relationStore.index(this.relatedIndexName);

    const result = new Set<PrimaryKeyType>();

    await Promise.all(
      relatedIds.map(async (relatedId) => {
        const relations = await promisifyRequest<Record<string, PrimaryKeyType>[]>(
          index.getAll(IDBKeyRange.only(relatedId)),
        );
        relations.forEach((relation) => {
          const sourceId = relation[this.sourceForeignKey];
          if (sourceId !== undefined) {
            result.add(sourceId);
          }
        });
      }),
    );

    return Array.from(result);
  }

  private buildSourceToRelatedMap(
    relationObjectStore: IDBObjectStore,
    sourceIds?: Set<PrimaryKeyType>,
  ) {
    return new Promise<Map<PrimaryKeyType, PrimaryKeyType[]>>((resolve, reject) => {
      const relationIndex = relationObjectStore.index(
        this.sourceIndexName,
      );

      const request = relationIndex.openCursor();
      const map = new Map<PrimaryKeyType, PrimaryKeyType[]>();

      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          resolve(map);
          return;
        }

        const relation = cursor.value;
        const sourceId = relation[this.sourceForeignKey];

        if (sourceId && (!sourceIds || sourceIds.has(sourceId))) {
          const relatedId = relation[this.relatedForeignKey];
          if (relatedId) {
            if (!map.has(sourceId)) {
              map.set(sourceId, []);
            }
            map.get(sourceId)!.push(relatedId);
          }
        }

        cursor.continue();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async buildRelatedMap<R extends MinimalEntity>(
    relatedObjectStore: IDBObjectStore,
  ) {
    const relatedEntities = await new Promise<R[]>((resolve, reject) => {
      const request = relatedObjectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return new Map(relatedEntities.map(entity => [entity.id, entity]));
  }

  private async attachRelations<
    S extends MinimalEntity,
    R extends MinimalEntity,
    K extends string,
  >(
    entities: S[],
    sourceToRelatedMap: Map<PrimaryKeyType, PrimaryKeyType[]>,
    relatedMap: Map<PrimaryKeyType, R>,
  ) {
    return entities.map((entity) => {
      const relatedIds = sourceToRelatedMap.get(entity.id) || [];
      const populatedRelated = relatedIds
        .map(id => relatedMap.get(id))
        .filter((related): related is R => Boolean(related));

      return {
        ...entity,
        [this.relatedField]: populatedRelated,
      };
    }) as (S & { [key in K]: R[] })[];
  }
}
