import type { Editor as EditorInstanceType } from '@tiptap/vue-3';
import type { BubbleMenuOptions as EditorBubbleMenuOptions } from '@tiptap/extension-bubble-menu';

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

export type { EditorInstanceType, EditorBubbleMenuOptions };
