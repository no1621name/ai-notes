import { ref, watch, computed, type Ref } from 'vue';
import type { Editor } from '@tiptap/vue-3';

export function useSearchReplace(editor: Ref<Editor | undefined>) {
  const searchTerm = ref<string>('');
  const replaceTerm = ref<string>('');
  const caseSensitive = ref<boolean>(false);

  const withEditor = (fn: (editor: Editor) => void) => {
    if (!editor.value) return;
    fn(editor.value);
  };

  const clear = () => {
    searchTerm.value = '';
    replaceTerm.value = '';
    caseSensitive.value = false;
    editor.value?.commands.resetIndex();
  };

  const updateSearchReplace = (clearIndex: boolean = false) => {
    withEditor((editor) => {
      if (clearIndex) {
        editor.commands.resetIndex();
      }

      editor.commands.setSearchTerm(searchTerm.value);
      editor.commands.setReplaceTerm(replaceTerm.value);
      editor.commands.setCaseSensitive(caseSensitive.value);
    });
  };

  const goToSelection = () => {
    withEditor((editor) => {
      const { results, resultIndex } = editor.storage.searchAndReplace;
      const position = results[resultIndex];

      if (!position) return;

      editor.commands.setTextSelection(position);

      const { node } = editor.view.domAtPos(
        editor.state.selection.anchor,
      );

      if (node instanceof HTMLElement) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  const replace = () => {
    withEditor((editor) => {
      editor.commands.replace();
      goToSelection();
    });
  };

  const next = () => {
    withEditor((editor) => {
      editor.commands.nextSearchResult();
      goToSelection();
    });
  };

  const previous = () => {
    withEditor((editor) => {
      editor.commands.previousSearchResult();
      goToSelection();
    });
  };

  const replaceAll = () => {
    withEditor((editor) => {
      editor.commands.replaceAll();
    });
  };

  watch(
    () => searchTerm.value.trim(),
    (val, oldVal) => {
      if (val !== oldVal) {
        updateSearchReplace(true);
      }
    },
  );

  watch(
    () => replaceTerm.value.trim(),
    (val, oldVal) => {
      if (val !== oldVal) {
        updateSearchReplace();
      }
    },
  );

  watch(
    () => caseSensitive.value,
    (val, oldVal) => {
      if (val !== oldVal) {
        updateSearchReplace(true);
      }
    },
  );

  watch(
    editor,
    (val) => {
      if (val) {
        updateSearchReplace();
      }
    },
    { immediate: true },
  );

  const resultIndex = computed(() => editor.value?.storage.searchAndReplace.resultIndex ?? -1);

  const resultCount = computed(() => editor.value?.storage.searchAndReplace.results.length ?? 0);

  return {
    searchTerm,
    replaceTerm,
    caseSensitive,
    updateSearchReplace,
    replace,
    next,
    previous,
    clear,
    replaceAll,
    resultIndex,
    resultCount,
  };
}
