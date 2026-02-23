import type { WithTags, TagBody, Tag } from '@/entities/tag/@x/note';
import { toDescription } from '@/entities/md-editor/@x/note';
import type { DBDataTransfer } from '@/shared/api/db/client';
import { ManyToManyManager } from '@/shared/api/db/relations/many-to-many';
import PaginationService from '@/shared/api/db/services/pagination';
import type { NoteData } from '../../model/types';
import { noteToTagRelationConfig, storeConfig } from '../store-config';
import type { NoteBody, NoteShort } from '../contracts';

interface GetNotesWithTagsParams {
  page?: number;
  pageSize?: number;
  search?: {
    fields: (keyof NoteData)[];
    text: string;
  };
  tags?: Tag['id'][];
}

export const getNotesWithTags = async (
  dataTransfer: DBDataTransfer,
  { page = 1, pageSize = 5, search, tags = [] }: GetNotesWithTagsParams,
): Promise<WithTags<NoteShort>[]> => {
  const relationManager = new ManyToManyManager(noteToTagRelationConfig, dataTransfer);
  const pagination = new PaginationService(storeConfig, dataTransfer);

  let allowedIds;

  if (tags && tags.length) {
    allowedIds = await relationManager.findSourceIdsByRelatedIds(tags);
  }

  const notes = await pagination.getPage<NoteBody>(
    storeConfig.name,
    {
      page,
      pageSize,
      search,
      allowedIds,
    },
  );

  const notesWithTags = await relationManager.populateRelations<NoteBody, TagBody, 'tags'>(notes);

  return notesWithTags
    .map<WithTags<NoteShort>>(({ text, ...note }) => ({
      ...note,
      description: (() => {
        if (!text) return '';
        try {
          return toDescription(JSON.parse(text));
        } catch {
          return '';
        }
      })(),
    }));
};
