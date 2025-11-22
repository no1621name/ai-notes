import { generateText, type JSONContent } from '@tiptap/vue-3';
import { plugins } from './plugins';

export const toDescription = (content: JSONContent) => {
  return generateText(content, plugins).slice(0, 150);
};
