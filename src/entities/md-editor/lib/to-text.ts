import { type JSONContent } from '@tiptap/vue-3';
import { toText } from '@/shared/lib/tiptap/to-text';

export const toDescription = (content: JSONContent): string => {
  return toText(content).slice(0, 150);
};
