import { computed } from 'vue';
import { useEditor } from '@/entities/md-editor';

export const useAiHelper = () => {
  const { editor } = useEditor();

  const isActive = computed(() => editor.value?.storage.aiHelper.isActive ?? false);
  const shouldClose = computed(() => editor.value?.storage.aiHelper.shouldClose ?? false);

  const toggleAiHelper = () => {
    editor.value?.commands.toggleAiHelper();
  };

  const closeAiHelper = () => {
    editor.value?.commands.closeAiHelper();
  };

  const setShouldCloseAiHelper = (value: boolean) => {
    editor.value?.commands.setShouldCloseAiHelper(value);
  };

  const applyAiResponse = (content: string) => {
    editor.value?.commands.applyAiResponse(content);
  };

  return {
    isActive,
    shouldClose,
    toggleAiHelper,
    applyAiResponse,
    closeAiHelper,
    setShouldCloseAiHelper,
  };
};
