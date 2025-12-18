import { inject, provide, type InjectionKey, type ShallowRef } from 'vue';
import type { EditorInstanceType } from '../model/types';

type EditorRef = ShallowRef<{
  readonly editor: EditorInstanceType;
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
