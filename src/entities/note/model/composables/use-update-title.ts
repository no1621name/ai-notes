import type { MaybeRef } from 'vue';
import { useUpdateNote } from '../../queries/use-update-note';
import { debounce } from '@/shared/lib/debounce';

export const useUpdateTitle = (noteId: MaybeRef<string>) => {
  const { mutate } = useUpdateNote(noteId);

  const updateTitle = debounce((title: string | undefined | null, oldTitle: null | string) => {
    if (oldTitle === null || title === null || title === undefined || title === oldTitle) {
      return;
    }

    const trimmed = title.replaceAll('\n', ' ');

    if (!trimmed) {
      return;
    }

    mutate({
      body: {
        title,
      },
    });
  }, 1000);

  return { updateTitle };
};
