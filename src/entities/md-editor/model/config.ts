import type { EditorAction, EditorBubbleMenuNames } from './types';

export const BUBBLE_MENU_PLUGIN_KEYS: Record<EditorBubbleMenuNames, string> = {
  main: 'main-bubble-menu',
  ai: 'ai-bubble-menu',
};

export const DEFAULT_QUICK_ACTIONS: EditorAction['id'][] = ['bold', 'italic', 'strikethrough'];

export const DEFAULT_FORMATTING_ACTIONS: EditorAction[] = [
  {
    id: 'heading1',
    label: 'Заголовок 1',
    icon: 'lu:heading-1',
    action: editor => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: editor => editor.isActive('heading', { level: 1 }),
  },
  {
    id: 'heading2',
    label: 'Заголовок 2',
    icon: 'lu:heading-2',
    action: editor => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: editor => editor.isActive('heading', { level: 2 }),
  },
  {
    id: 'heading3',
    label: 'Заголовок 3',
    icon: 'lu:heading-3',
    action: editor => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: editor => editor.isActive('heading', { level: 3 }),
  },
  {
    id: 'bold',
    label: 'Жирный',
    icon: 'lu:bold',
    action: editor => editor.chain().focus().toggleBold().run(),
    isActive: editor => editor.isActive('bold'),
  },
  {
    id: 'italic',
    label: 'Курсив',
    icon: 'lu:italic',
    action: editor => editor.chain().focus().toggleItalic().run(),
    isActive: editor => editor.isActive('italic'),
  },
  {
    id: 'strikethrough',
    label: 'Зачеркнутый',
    icon: 'lu:strikethrough',
    action: editor => editor.chain().focus().toggleStrike().run(),
    isActive: editor => editor.isActive('strike'),
  },
  {
    id: 'bulletList',
    label: 'Маркированный список',
    icon: 'lu:list',
    action: editor => editor.chain().focus().toggleBulletList().run(),
    isActive: editor => editor.isActive('bulletList'),
  },
  {
    id: 'orderedList',
    label: 'Нумерованный список',
    icon: 'lu:list-ordered',
    action: editor => editor.chain().focus().toggleOrderedList().run(),
    isActive: editor => editor.isActive('orderedList'),
  },
  {
    id: 'taskList',
    label: 'Список задач',
    icon: 'lu:list-checks',
    action: editor => editor.chain().focus().toggleTaskList().run(),
    isActive: editor => editor.isActive('taskList'),
  },
  {
    id: 'blockquote',
    label: 'Цитата',
    icon: 'lu:quote',
    action: editor => editor.chain().focus().toggleBlockquote().run(),
    isActive: editor => editor.isActive('blockquote'),
  },
];

export const DEFAULT_ADDITIONAL_ACTIONS: Record<string, EditorAction> = {
  undo: {
    id: 'undo',
    label: 'Обратно',
    icon: 'lu:undo',
    action: editor => editor.chain().focus().undo().run(),
    isActive: () => false,
    isDisabled: editor => !editor.can().chain().focus().undo().run(),
  },
  redo: {
    id: 'redo',
    label: 'Вперед',
    icon: 'lu:redo',
    action: editor => editor.chain().focus().redo().run(),
    isActive: () => false,
    isDisabled: editor => !editor.can().chain().focus().redo().run(),
  },
};

export const DEFAULT_ACTIONS = [...DEFAULT_FORMATTING_ACTIONS, ...Object.values(DEFAULT_ADDITIONAL_ACTIONS)];
