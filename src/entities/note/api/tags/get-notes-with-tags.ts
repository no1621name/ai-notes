import type { WithTags, TagBody } from '@/entities/tag/@x/note';
import { toDescription } from '@/entities/md-editor/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import type { NoteBody, NoteShort } from '../contracts';
import { noteToTagRelationConfig, storeConfig } from '../store-config';
import { delay } from '@/shared/lib/delay';
import PaginationService from '@/shared/api/db/services/pagination';

interface GetNotesWithTagsParams {
  page?: number;
  pageSize?: number;
  search?: {
    fields: string[];
    text: string;
  };
}

export const getNotesWithTags = async (
  dataTransfer: DBDataTransfer,
  { page = 1, pageSize = 5, search }: GetNotesWithTagsParams,
): Promise<WithTags<NoteShort>[]> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  const pagination = new PaginationService(storeConfig, dataTransfer);

  const notes = await pagination.getPage<NoteBody>(
    storeConfig.name,
    {
      page,
      pageSize,
      search,
    },
  );

  const notesWithTags = await relationManager.populateRelations<NoteBody, TagBody, 'tags'>(notes);
  await delay(1000);
  return notesWithTags
    .map<WithTags<NoteShort>>(({ text, ...note }) => ({
      ...note,
      description: text ? toDescription(JSON.parse(text)) : '',
    }));
};
