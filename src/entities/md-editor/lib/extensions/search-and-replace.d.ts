import type { SearchAndReplaceStorage } from '@sereneinserenade/tiptap-search-and-replace';

declare module '@tiptap/core' {
  interface Storage {
    searchAndReplace: SearchAndReplaceStorage;
  }
}
