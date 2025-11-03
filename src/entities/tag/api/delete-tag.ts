import type { DBDataTransfer } from '@/shared/api/db/client';
import type { PrimaryKeyType } from '@/shared/types/api';
import { storeConfig } from './store-config';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import { noteToTagRelationConfig } from '@/entities/note/@x/tag';

export const deleteTag = async (dataTransfer: DBDataTransfer, id: PrimaryKeyType) => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);

  await Promise.all([
    dataTransfer.delete(storeConfig.name, id),
    relationManager.deleteRelationsByRelatedId(id),
  ]);
};
