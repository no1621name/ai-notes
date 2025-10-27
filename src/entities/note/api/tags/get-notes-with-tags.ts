import type { DBDataTransfer } from '@/shared/api/db/client';
import { tagsStoreConfig, type Tag } from '@/entities/tag/@x/note';
import { relationConfig, storeConfig } from '../store-config';
import type { NoteData, NoteTagRelation } from '../../model/types';

export const getNotesWithTags = async (dataTransfer: DBDataTransfer) => {
  const [notesStore, relationStore, tagsStore] = await dataTransfer.getStores([
    storeConfig.name,
    relationConfig.name,
    tagsStoreConfig.name,
  ]);

  const notes = await new Promise<NoteData[]>((resolve, reject) => {
    const request = notesStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const notesMap = new Map(notes.map(note => [note.id, note]));

  const noteTagsMap = await new Promise<Map<string, string[]>>((resolve, reject) => {
    const noteIdIndex = relationStore.index(relationConfig.indexes!.noteId.name);
    const request = noteIdIndex.openCursor();
    const relationsMap = new Map<string, string[]>();

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const relation = cursor.value as NoteTagRelation;
        if (!relationsMap.has(relation.note_id)) {
          relationsMap.set(relation.note_id, []);
        }
        relationsMap.get(relation.note_id)!.push(relation.tag_id);
        cursor.continue();
      } else {
        resolve(relationsMap);
      }
    };

    request.onerror = () => reject(request.error);
  });

  const allTagsIds = new Set(Array.from(noteTagsMap.values()).flat());
  if (!allTagsIds.size) {
    return Array.from(notesMap.values()).map(note => ({
      ...note,
      tags: [],
    }));
  }

  const tags = await new Promise<Tag[]>((resolve, reject) => {
    const request = tagsStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const tagsMap = new Map(tags.map(tag => [tag.id, tag]));

  return Array.from(notesMap.values()).map((note) => {
    const tagIds = noteTagsMap.get(note.id) || [];
    const noteTags = tagIds.map(tagId => tagsMap.get(tagId)).filter(tag => typeof tag !== 'undefined');

    return {
      ...note,
      tags: noteTags,
    };
  });
};
