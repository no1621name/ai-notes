import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  dbClient,
  manager,
  sourceConfig,
  relationConfig,
  relatedConfig,
  type Source,
  type Related,
  type Relation,
} from './mocks';

describe('ManyToManyManager', () => {
  beforeAll(async () => {
    await dbClient.create<Source>(sourceConfig.name, {
      name: 'Test source name 1',
      id: 'source_1',
    });

    await dbClient.create<Related>(relatedConfig.name, {
      name: 'Test related name 1',
      id: 'related_1',
    });
  });

  beforeEach(async () => {
    const allRelations = await dbClient.getAll<Relation>(relationConfig.name);
    await Promise.all(allRelations.map(record => dbClient.delete(relationConfig.name, record.id)));

    const allSources = await dbClient.getAll<Source>(sourceConfig.name);
    await Promise.all(allSources.map(record => record.id !== 'source_1' && dbClient.delete(sourceConfig.name, record.id)));

    const allRelated = await dbClient.getAll<Related>(relatedConfig.name);
    await Promise.all(allRelated.map(record => record.id !== 'related_1' && dbClient.delete(relatedConfig.name, record.id)));
  });

  const createDefaultRelation = async () => {
    await manager.addRelation('source_1', 'related_1');

    return await dbClient.getAll<Relation>(relationConfig.name);
  };

  it('should correctly create new relation', async () => {
    const allRelations = await createDefaultRelation();

    expect(allRelations).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        source_id: 'source_1',
        related_id: 'related_1',
      },
    ]));
  });

  it('should correctly delete relation by relation id', async () => {
    const defaultRelations = await createDefaultRelation();
    expect(defaultRelations).toHaveLength(1);
    await manager.deleteRelation('source_1', 'related_1');
    expect(await dbClient.getAll(relationConfig.name)).toHaveLength(0);
  });

  it('should correctly delete relation by source id', async () => {
    const defaultRelations = await createDefaultRelation();
    expect(defaultRelations).toHaveLength(1);
    await manager.deleteRelationsBySourceId('source_1');
    expect(await dbClient.getAll(relationConfig.name)).toHaveLength(0);
  });

  it('should correctly delete relation by related id', async () => {
    const defaultRelations = await createDefaultRelation();
    expect(defaultRelations).toHaveLength(1);
    await manager.deleteRelationsByRelatedId('related_1');
    expect(await dbClient.getAll(relationConfig.name)).toHaveLength(0);
  });

  it('should correctlry get source item with fetched relations', async () => {
    await dbClient.create<Related>('related', {
      name: 'Test related name 2',
      id: 'related_2',
    });

    await manager.addRelation('source_1', 'related_1');
    await manager.addRelation('source_1', 'related_2');

    const source = await manager.get<Source, Related, 'related'>('source_1');

    expect(source).toEqual({
      id: 'source_1',
      name: 'Test source name 1',
      related: expect.arrayContaining([
        {
          id: 'related_1',
          name: 'Test related name 1',
        },
        {
          id: 'related_2',
          name: 'Test related name 2',
        },
      ]),
    });
  });

  it('should correctly get all source items with fetched relations', async () => {
    await dbClient.create<Source>(sourceConfig.name, {
      name: 'Test source name 2',
      id: 'source_2',
    });

    await dbClient.create<Related>(relatedConfig.name, {
      name: 'Test related name 2',
      id: 'related_2',
    });

    await manager.addRelation('source_1', 'related_1');
    await manager.addRelation('source_1', 'related_2');

    await manager.addRelation('source_2', 'related_1');

    const sources = await manager.getAll<Source, Related, 'related'>();

    expect(sources).toEqual(expect.arrayContaining([
      {
        id: 'source_1',
        name: 'Test source name 1',
        related: expect.arrayContaining([
          {
            id: 'related_1',
            name: 'Test related name 1',
          },
        ]),
      },
      {
        id: 'source_2',
        name: 'Test source name 2',
        related: expect.arrayContaining([
          {
            id: 'related_1',
            name: 'Test related name 1',
          },
        ]),
      },
    ]));
  });
});
