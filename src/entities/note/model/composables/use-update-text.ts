import { debounce } from '@/shared/lib/debounce';
import { type Ref, watch } from 'vue';
import { useUpdateNote } from '../../queries/use-update-note';
import type { JSONContent } from '@tiptap/vue-3';
import { useToasterStore } from '@/app/stores/toaster';

let globalMutationId = 0;

export const useUpdateText = (noteId: Ref<string>, onDebounced?: () => void) => {
  const { add } = useToasterStore();
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
        text,
        __mutationId: mutationId,
      });
    } catch {
      add({
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
