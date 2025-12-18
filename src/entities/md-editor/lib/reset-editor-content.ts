import { history } from '@tiptap/pm/history';
import type { EditorInstanceType } from '../model/types';

export const resetEditorContent = (editor: EditorInstanceType, newContent: string) => {
  editor.chain().setMeta('addToHistory', false).setContent(newContent, {
    emitUpdate: false,
  }).run();

  editor.unregisterPlugin('history');
  editor.registerPlugin(history());
};
