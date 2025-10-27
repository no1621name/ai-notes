import type { InjectionKey, ShallowRef } from 'vue';
import type { EditorInstanceType } from './types';

export const editorInjectionKey = Symbol('editor') as InjectionKey<ShallowRef<{
  readonly editor: EditorInstanceType;
} | null>>;
