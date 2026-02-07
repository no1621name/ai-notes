import { onMounted, ref, watch } from 'vue';
import { DEFAULT_THEME, THEME_KEY } from '../constants/theme';
import { onBroadcastMessage, sendBroadcastMessage } from '../lib/broadcast';

const currentTheme = ref(DEFAULT_THEME);

export const useTheme = () => {
  let themeSynced = false;

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    currentTheme.value = savedTheme;

    document.documentElement.setAttribute('data-theme', savedTheme);

    onBroadcastMessage<string>('theme-changed', (event) => {
      currentTheme.value = event;
      themeSynced = true;
    });
  });

  watch(currentTheme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    if (themeSynced) {
      themeSynced = false;
      return;
    }

    sendBroadcastMessage<string>('theme-changed', newTheme);
  });

  return currentTheme;
};
