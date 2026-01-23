import type { BaseAction } from '../types';

type ActionName = 'heading1' | 'heading2' | 'heading3' | 'bold' | 'italic'
  | 'strikethrough' | 'bulletList' | 'orderedList' | 'taskList' | 'blockquote' | 'undo'
  | 'redo' | 'code' | 'aiHelper';

export const ACTIONS_DEFINITIONS: Record<ActionName, BaseAction> = {
  heading1: {
    id: 'heading1',
    label: 'editorActions.heading1',
    icon: 'lu:heading-1',
  },
  heading2: {
    id: 'heading2',
    label: 'editorActions.heading2',
    icon: 'lu:heading-2',
  },
  heading3: {
    id: 'heading3',
    label: 'editorActions.heading3',
    icon: 'lu:heading-3',
  },
  bold: {
    id: 'bold',
    label: 'editorActions.bold',
    icon: 'lu:bold',
  },
  italic: {
    id: 'italic',
    label: 'editorActions.italic',
    icon: 'lu:italic',
  },
  strikethrough: {
    id: 'strikethrough',
    label: 'editorActions.strikethrough',
    icon: 'lu:strikethrough',
  },
  bulletList: {
    id: 'bulletList',
    label: 'editorActions.bulletList',
    icon: 'lu:list',
  },
  orderedList: {
    id: 'orderedList',
    label: 'editorActions.orderedList',
    icon: 'lu:list-ordered',
  },
  taskList: {
    id: 'taskList',
    label: 'editorActions.taskList',
    icon: 'lu:list-checks',
  },
  blockquote: {
    id: 'blockquote',
    label: 'editorActions.blockquote',
    icon: 'lu:quote',
  },
  undo: {
    id: 'undo',
    label: 'editorActions.undo',
    icon: 'lu:undo',
  },
  redo: {
    id: 'redo',
    label: 'editorActions.redo',
    icon: 'lu:redo',
  },
  code: {
    id: 'code',
    label: 'editorActions.code',
    icon: 'lu:code-xml',
  },
  aiHelper: {
    id: 'aiHelper',
    label: 'editorActions.aiHelper',
    icon: 'lu:robot',
  },
};
