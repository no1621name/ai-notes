import { history } from '@tiptap/pm/history';
import { type Editor } from '@tiptap/vue-3';

export const resetEditorContent = (editor: Editor, newContent: string) => {
  editor.chain().setMeta('addToHistory', false).setContent(newContent, {
    emitUpdate: false,
  }).run();

  editor.unregisterPlugin('history');
  editor.registerPlugin(history());
};
