import { generateText, type JSONContent } from '@tiptap/vue-3';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { plugins } from './plugins';

export const toDescription = (content: JSONContent) => {
  return generateText(content, [...plugins, CodeBlockLowlight]).slice(0, 150);
};
