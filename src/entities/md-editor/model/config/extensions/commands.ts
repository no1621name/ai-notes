import type { CommandItem } from '../../../lib/extensions/commands';
import type { BaseAction } from '../../types';
import { ACTIONS_DEFINITIONS } from './../actions';

const createCommandItem = (
  base: BaseAction,
  config: Omit<CommandItem, keyof BaseAction>,
): CommandItem => ({
  ...base,
  ...config,
});

export const DEFAULT_COMMAND_ITEMS: CommandItem[] = [
  createCommandItem(ACTIONS_DEFINITIONS.heading1, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  }),
  createCommandItem(ACTIONS_DEFINITIONS.heading2, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  }),
  createCommandItem(ACTIONS_DEFINITIONS.heading3, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  }),
  createCommandItem(ACTIONS_DEFINITIONS.orderedList, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  }),
  createCommandItem(ACTIONS_DEFINITIONS.bulletList, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  }),
  createCommandItem(ACTIONS_DEFINITIONS.taskList, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  }),
  createCommandItem(ACTIONS_DEFINITIONS.blockquote, {
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  }),
];
