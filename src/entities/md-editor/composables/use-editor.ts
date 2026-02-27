import { computed, inject, provide, shallowRef, type InjectionKey } from 'vue';
import type { EditorRef } from '../model/types';

const editorInjectionKey = Symbol('editor') as InjectionKey<EditorRef>;

export const useProvideEditor = (editorRef: EditorRef) => {
  provide(editorInjectionKey, editorRef);
};

export const useEditor = () => {
  const editorRef = inject(editorInjectionKey, shallowRef(null));

  const editor = computed(() => editorRef.value?.editor);

  return {
    editor,
  };
};
