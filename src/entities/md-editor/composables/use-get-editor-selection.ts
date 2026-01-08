import { useEditor } from './use-editor';

export const useGetEditorSelection = () => {
  const { editor } = useEditor();

  return {
    getEditorSelection: () => {
      if (!editor.value) return '';

      const { to, from } = editor.value.state.selection;
      return editor.value.state.doc.textBetween(from, to);
    },
  };
};
