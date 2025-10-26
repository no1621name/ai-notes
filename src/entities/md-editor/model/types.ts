import type { Editor as EditorInstanceType } from '@tiptap/vue-3';
import type { BubbleMenuOptions as EditorBubbleMenuOptions } from '@tiptap/extension-bubble-menu';

export interface EditorAction {
  id: string;
  label: string;
  icon: string;
  action: (editor: EditorInstanceType) => void;
  isActive: (editor: EditorInstanceType) => boolean;
  isDisabled?: (editor: EditorInstanceType) => boolean;
}

export type EditorBubbleMenuNames = 'main' | 'ai';

export type { EditorInstanceType, EditorBubbleMenuOptions };
