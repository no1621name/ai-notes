import type { Editor, Range } from '@tiptap/core';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import type { BaseAction } from '@/entities/md-editor/model/types';

interface CommandOptions {
  editor: Editor;
  range: Range;
}

export interface CommandItem extends BaseAction {
  command: (options: CommandOptions) => void;
}

export type RendererComponentProps = SuggestionProps<CommandItem>;

export type CommandsOptions = Partial<SuggestionOptions<CommandItem>>;
