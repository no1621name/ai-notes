import type { BaseAction } from '../types';

type ActionName = 'heading1' | 'heading2' | 'heading3' | 'bold' | 'italic'
  | 'strikethrough' | 'bulletList' | 'orderedList' | 'taskList' | 'blockquote' | 'undo'
  | 'redo' | 'code' | 'aiHelper';

export const ACTIONS_DEFINITIONS: Record<ActionName, BaseAction> = {
  heading1: {
    id: 'heading1',
    label: ' Heading 1',
    icon: 'lu:heading-1',
  },
  heading2: {
    id: 'heading2',
    label: 'Heading 2',
    icon: 'lu:heading-2',
  },
  heading3: {
    id: 'heading3',
    label: 'Heading 3',
    icon: 'lu:heading-3',
  },
  bold: {
    id: 'bold',
    label: 'Bold',
    icon: 'lu:bold',
  },
  italic: {
    id: 'italic',
    label: 'Italic',
    icon: 'lu:italic',
  },
  strikethrough: {
    id: 'strikethrough',
    label: 'Strikethrough',
    icon: 'lu:strikethrough',
  },
  bulletList: {
    id: 'bulletList',
    label: 'Bullet List',
    icon: 'lu:list',
  },
  orderedList: {
    id: 'orderedList',
    label: 'Ordered List',
    icon: 'lu:list-ordered',
  },
  taskList: {
    id: 'taskList',
    label: 'Task List',
    icon: 'lu:list-checks',
  },
  blockquote: {
    id: 'blockquote',
    label: 'Blockquote',
    icon: 'lu:quote',
  },
  undo: {
    id: 'undo',
    label: 'Undo',
    icon: 'lu:undo',
  },
  redo: {
    id: 'redo',
    label: 'Redo',
    icon: 'lu:redo',
  },
  code: {
    id: 'code',
    label: 'Code',
    icon: 'lu:code-xml',
  },
  aiHelper: {
    id: 'aiHelper',
    label: 'AI Helper',
    icon: 'lu:robot',
  },
};
