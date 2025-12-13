import { generateText, type JSONContent } from '@tiptap/vue-3';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { plugins } from './plugins';

export const toText = (content: JSONContent) => {
  return generateText(content, [...plugins, CodeBlockLowlight]);
};

export const toDescription = (content: JSONContent) => {
  return toText(content).slice(0, 150);
};
