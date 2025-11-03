import type { DBDataTransfer } from '@/shared/api/db/client';
import type { PrimaryKeyType } from '@/shared/types/api';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import { noteToTagRelationConfig } from '../store-config';

export const addTagToNote = (dataTransfer: DBDataTransfer, noteId: PrimaryKeyType, tagId: PrimaryKeyType) => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  return relationManager.addRelation(noteId, tagId);
};
