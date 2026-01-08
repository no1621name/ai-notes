import { Extension } from '@tiptap/core';

interface AiHelperStorage {
  isActive: boolean;
  shouldClose: boolean;
}

declare module '@tiptap/core' {
  interface Storage {
    aiHelper: AiHelperStorage;
  }

  interface Commands<ReturnType> {
    aiHelper: {
      setShouldCloseAiHelper: (value: boolean) => ReturnType;
      openAiHelper: () => ReturnType;
      closeAiHelper: () => ReturnType;
      toggleAiHelper: () => ReturnType;
      applyAiResponse: (text: string) => ReturnType;
    };
  }
}

export const aiHelperExtension = Extension.create<unknown, AiHelperStorage>({
  name: 'aiHelper',
  addStorage() {
    return {
      isActive: false,
      shouldClose: false,
    };
  },
  addCommands() {
    return {
      toggleAiHelper: () =>
        () => {
          this.editor.storage.aiHelper.isActive = !this.editor.storage.aiHelper.isActive;
          return true;
        },
      openAiHelper: () =>
        () => {
          this.editor.storage.aiHelper.isActive = true;
          return true;
        },
      closeAiHelper: () =>
        () => {
          this.editor.storage.aiHelper.isActive = false;
          return true;
        },
      setShouldCloseAiHelper: (value: boolean) =>
        () => {
          this.editor.storage.aiHelper.shouldClose = value;
          return true;
        },
      applyAiResponse: (text: string) =>
        ({ view, commands }) => {
          commands.deleteSelection();
          commands.insertContentAt(view.state.selection.from, text, { contentType: 'markdown' });
          return true;
        },
    };
  },
});
