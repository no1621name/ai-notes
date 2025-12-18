import type { Editor } from '@tiptap/vue-3';
import { inject, provide, type InjectionKey, type ShallowRef } from 'vue';

type EditorRef = ShallowRef<{
  readonly editor: Editor;
} | null>;

const editorInjectionKey = Symbol('editor') as InjectionKey<EditorRef>;

export const useEditor = () => {
  const getEditor = () => inject(editorInjectionKey);

  const setEditor = (editorRef: EditorRef) => provide(editorInjectionKey, editorRef);

  return {
    getEditor,
    setEditor,
  };
};
