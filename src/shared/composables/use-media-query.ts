import { ref } from 'vue';

export const useMediaQuery = (query: string) => {
  const mediaQuery = matchMedia(query);
  const matches = ref<boolean>(mediaQuery.matches);

  mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  });

  return matches;
};

export const useIsMobile = () => useMediaQuery('(width < 40rem)');
