import type { ShallowRef } from 'vue';
import type { Editor as EditorInstanceType } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/vue-3/menus';

export interface BaseAction {
  id: string;
  label: string;
  icon: string;
}

export interface EditorAction extends BaseAction {
  action: (editor: EditorInstanceType) => void;
  isActive: (editor: EditorInstanceType) => boolean;
  isDisabled?: (editor: EditorInstanceType) => boolean;
}

export type EditorBubbleMenuNames = 'main' | 'ai';
export type EditorBubbleFloatingOptions = InstanceType<typeof BubbleMenu>['$props']['options'];

export type EditorRef = ShallowRef<{
  readonly editor: EditorInstanceType;
} | null>;

export type { EditorInstanceType };
