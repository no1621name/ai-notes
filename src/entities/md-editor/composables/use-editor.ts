import { computed, inject, provide, shallowRef, type InjectionKey } from 'vue';
import type { EditorRef } from '../model/types';

const editorInjectionKey = Symbol('editor') as InjectionKey<EditorRef>;

export const useEditor = () => {
  const editorRef = inject(editorInjectionKey, shallowRef(null));

  const setEditor = (editorRef: EditorRef) => provide(editorInjectionKey, editorRef);

  const editor = computed(() => editorRef.value?.editor);

  return {
    editor,
    setEditor,
  };
};
