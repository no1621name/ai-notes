import { ACTIONS_DEFINITIONS, type BaseAction, type EditorAction } from '@/entities/md-editor';

const createEditorAction = (
  base: BaseAction,
  config: Omit<EditorAction, keyof BaseAction>,
): EditorAction => ({
  ...base,
  ...config,
});

export const DEFAULT_FORMATTING_ACTIONS: EditorAction[] = [
  createEditorAction(ACTIONS_DEFINITIONS.heading1, {
    action: editor => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: editor => editor.isActive('heading', { level: 1 }),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.heading2, {
    action: editor => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: editor => editor.isActive('heading', { level: 2 }),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.heading3, {
    action: editor => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: editor => editor.isActive('heading', { level: 3 }),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.bold, {
    action: editor => editor.chain().focus().toggleBold().run(),
    isActive: editor => editor.isActive('bold'),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.italic, {
    action: editor => editor.chain().focus().toggleItalic().run(),
    isActive: editor => editor.isActive('italic'),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.strikethrough, {
    action: editor => editor.chain().focus().toggleStrike().run(),
    isActive: editor => editor.isActive('strike'),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.bulletList, {
    action: editor => editor.chain().focus().toggleBulletList().run(),
    isActive: editor => editor.isActive('bulletList'),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.orderedList, {
    action: editor => editor.chain().focus().toggleOrderedList().run(),
    isActive: editor => editor.isActive('orderedList'),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.taskList, {
    action: editor => editor.chain().focus().toggleTaskList().run(),
    isActive: editor => editor.isActive('taskList'),
  }),
  createEditorAction(ACTIONS_DEFINITIONS.blockquote, {
    action: editor => editor.chain().focus().toggleBlockquote().run(),
    isActive: editor => editor.isActive('blockquote'),
  }),
];

export const DEFAULT_ADDITIONAL_ACTIONS: Record<string, EditorAction> = {
  undo: createEditorAction(ACTIONS_DEFINITIONS.undo, {
    action: editor => editor.chain().focus().undo().run(),
    isActive: () => false,
    isDisabled: editor => !editor.can().chain().focus().undo().run(),
  }),
  redo: createEditorAction(ACTIONS_DEFINITIONS.redo, {
    action: editor => editor.chain().focus().redo().run(),
    isActive: () => false,
    isDisabled: editor => !editor.can().chain().focus().redo().run(),
  }),
};

export const DEFAULT_ACTIONS = [...DEFAULT_FORMATTING_ACTIONS, ...Object.values(DEFAULT_ADDITIONAL_ACTIONS)];
