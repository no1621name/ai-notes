import { TaskItem, TaskList } from '@tiptap/extension-list';
import Typography from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

export const plugins = [
  StarterKit.configure({
    codeBlock: false,
  }),
  TaskItem.configure({
    nested: true,
  }),
  TaskList,
  Placeholder.configure({
    placeholder: 'Write something',
  }),
  Typography,
];
