import { ref, type Ref, watch } from 'vue';
import type { JSONContent } from '@tiptap/vue-3';

import { addToast } from '@/app/providers/toasts';
import { debounce } from '@/shared/lib/debounce';
import { useUpdateNote } from '../../queries/use-update-note';

export const useUpdateText = (noteId: Ref<string>, onDebounced?: () => void) => {
  const { mutate } = useUpdateNote(noteId);
  const mutationId = ref(0);

  watch(noteId, () => {
    mutationId.value = 0;
  });

  const updateText = debounce((content: JSONContent) => {
    try {
      onDebounced?.();

      const text = JSON.stringify(content);
      mutationId.value++;

      mutate({
        body: {
          text,
          __mutationId: mutationId.value,
        },
      });
    } catch {
      addToast({
        title: 'toasts.error.title',
        message: 'toasts.error.parsing.updateFailed',
        type: 'danger',
      });
    }
  }, 1000);

  return {
    updateText,
  };
};
