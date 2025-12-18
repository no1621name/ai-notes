import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

import type { CommandsOptions } from './types';

export const commandsExtension = Extension.create<{ suggestion: CommandsOptions }>({
  name: 'commands',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
