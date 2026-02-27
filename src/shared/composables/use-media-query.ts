import { onScopeDispose, ref } from 'vue';

export const useMediaQuery = (query: string) => {
  const mediaQuery = matchMedia(query);
  const matches = ref<boolean>(mediaQuery.matches);

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };

  mediaQuery.addEventListener('change', handler);
  onScopeDispose(() => mediaQuery.removeEventListener('change', handler));

  return matches;
};

export const useIsMobile = () => useMediaQuery('(width < 40rem)');
