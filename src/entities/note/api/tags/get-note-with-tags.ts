import { type Tag, tagsStoreConfig } from '@/entities/tag/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import type { PrimaryKeyType } from '@/shared/types/api';
import type { NoteData } from '../../model/types';
import { relationConfig, storeConfig } from '../store-config';

export const getNoteWithTags = async (dataTransfer: DBDataTransfer, noteId: PrimaryKeyType) => {
  const [noteStore, relationStore, tagStore] = await dataTransfer.getStores([
    storeConfig.name,
    relationConfig.name,
    tagsStoreConfig.name,
  ]);

  const note = await new Promise<NoteData>((resolve, reject) => {
    const request = noteStore.get(noteId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  if (!note) {
    throw new Error(`Note with id ${noteId} not found`);
  }

  const noteIdIndex = relationStore.index(relationConfig.indexes!.noteId.name);

  const tagIds = await new Promise<string[]>((resolve, reject) => {
    const request = noteIdIndex.getAll(noteId);
    request.onsuccess = () => resolve(request.result.map(relation => relation.tag_id));
    request.onerror = () => reject(request.error);
  });

  const tags: Tag[] = await Promise.all(
    tagIds.map(id =>
      new Promise<Tag>((resolve, reject) => {
        const request = tagStore.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
    ),
  );

  return {
    ...note,
    tags: tags,
  };
};
