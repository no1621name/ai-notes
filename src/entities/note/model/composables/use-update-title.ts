import type { MaybeRef } from 'vue';
import { useUpdateNote } from '../../queries/use-update-note';
import { debounce } from '@/shared/lib/debounce';

export const useUpdateTitle = (noteId: MaybeRef<string>) => {
  const { mutate } = useUpdateNote(noteId);

  const updateTitle = debounce((oldTitle: null | string, title: string | null) => {
    if (oldTitle === null || title === null || title === oldTitle) {
      return;
    }

    const trimmed = title.replaceAll('\n', ' ');

    if (!trimmed) {
      return;
    }

    mutate({
      title,
    });
  }, 1000);

  return { updateTitle };
};
