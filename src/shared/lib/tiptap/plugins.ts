import { TaskItem, TaskList } from '@tiptap/extension-list';
import Typography from '@tiptap/extension-typography';
import { CharacterCount } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';

export const plugins = [
  StarterKit.configure({
    codeBlock: false,
  }),
  Markdown,
  TaskItem.configure({
    nested: true,
  }),
  TaskList,
  Typography,
  CharacterCount,
];
