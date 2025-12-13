import { generateText, type JSONContent, type Extension } from '@tiptap/vue-3';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { plugins as commonPlugins } from './plugins';

export const toText = (content: JSONContent, plugins: Extension[] = []): string => {
  try {
    return generateText(content, [...plugins, ...commonPlugins, CodeBlockLowlight]);
  } catch (e) {
    console.error(e);
    return '';
  }
};
