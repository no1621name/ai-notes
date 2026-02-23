import { onMounted, onUnmounted } from 'vue';

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform: string;
  };
};

const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPod|iPad/i.test((navigator as NavigatorWithUserAgentData).userAgentData?.platform || navigator.platform);

const ALIASES: Record<string, string> = {
  meta: 'meta',
  shift: 'shift',
  alt: isMac ? 'option' : 'alt',
  esc: 'escape',
  mod: isMac ? 'meta' : 'ctrl',
};

export const SYMBOLS: Record<string, string> = {
  ctrl: isMac ? '⌃' : 'Ctrl',
  meta: '⌘',
  shift: '⇧',
  alt: isMac ? '⌥' : 'Alt',
  mod: isMac ? '⌘' : 'Ctrl',
  backspace: '⌫',
  enter: '⏎',
};

export const useHotkey = (binding: string, handler: (e: KeyboardEvent) => void, prevent = false) => {
  const parts = binding.toLowerCase().replace(/\s/g, '').split('+');
  const rawKey = parts.pop();
  const key = rawKey ? (ALIASES[rawKey] || rawKey) : '';
  const code = (() => {
    if (!key || key.length !== 1) return undefined;

    if (key >= 'a' && key <= 'z') return `Key${key.toUpperCase()}`;
    if (key >= '0' && key <= '9') return `Digit${key}`;

    return undefined;
  })();

  const requiredModifiers = new Set(
    parts.map(part => ALIASES[part] || part),
  );

  const listener = (e: KeyboardEvent) => {
    const isCodeMatch = code && e.code === code;
    const isKeyMatch = e.key.toLowerCase() === key;

    if (!isCodeMatch && !isKeyMatch) {
      return;
    }

    const pressedModifiers = new Set<string>();
    if (e.ctrlKey) pressedModifiers.add('ctrl');
    if (e.metaKey) pressedModifiers.add('meta');
    if (e.shiftKey) pressedModifiers.add('shift');
    if (e.altKey) pressedModifiers.add('alt');

    if (requiredModifiers.size !== pressedModifiers.size) {
      return;
    }

    for (const mod of requiredModifiers) {
      if (!pressedModifiers.has(mod)) {
        return;
      }
    }

    if (prevent) {
      e.preventDefault();
    }

    handler(e);
  };

  onMounted(() => {
    window.addEventListener('keydown', listener);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', listener);
  });
};
