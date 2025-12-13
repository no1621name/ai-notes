import { type Ref, watch } from 'vue';
import type { JSONContent } from '@tiptap/vue-3';

import { addToast } from '@/app/providers/toasts';
import { debounce } from '@/shared/lib/debounce';
import { useUpdateNote } from '../../queries/use-update-note';

let globalMutationId = 0;

export const useUpdateText = (noteId: Ref<string>, onDebounced?: () => void) => {
  const { mutate } = useUpdateNote(noteId);

  watch(noteId, () => {
    globalMutationId = 0;
  });

  const updateText = debounce((content: JSONContent) => {
    try {
      onDebounced?.();

      const text = JSON.stringify(content);
      const mutationId = ++globalMutationId;

      mutate({
        body: {
          text,
          __mutationId: mutationId,
        },
      });
    } catch {
      addToast({
        title: 'Update failed!',
        message: 'Failed to parse content',
        type: 'danger',
      });
    }
  }, 1000);

  return {
    updateText,
  };
};
