import type { InfiniteData } from '@tanstack/vue-query';
import { toChunks } from '@/shared/lib/to-chunks';
import type { NoteShort } from '../model/types';

export const updateNoteInCache = (
  notesData: InfiniteData<NoteShort[]> | undefined,
  noteId: string,
  updateFn: (note: NoteShort) => NoteShort,
): InfiniteData<NoteShort[]> | undefined => {
  if (!notesData) {
    return undefined;
  }

  const notes = notesData.pages.flat();
  const noteIndex = notes.findIndex(note => note.id === noteId);

  if (noteIndex < 0) {
    return notesData;
  }

  const newNotes = [...notes];
  newNotes[noteIndex] = updateFn(newNotes[noteIndex]!);

  return {
    pageParams: notesData.pageParams,
    pages: toChunks(newNotes, (notesData.pages[0] ?? []).length),
  };
};
