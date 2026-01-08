import { onMounted, onUnmounted } from 'vue';

const ALIASES: Record<string, string> = {
  ctrl: 'ctrl',
  control: 'ctrl',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  super: 'meta',
  shift: 'shift',
  alt: 'alt',
  option: 'alt',
  esc: 'escape',
  return: 'enter',
};

export const useHotkey = (binding: string, handler: (e: KeyboardEvent) => void) => {
  const parts = binding.toLowerCase().replace(/\s/g, '').split('+');
  const rawKey = parts.pop();
  const key = rawKey ? (ALIASES[rawKey] || rawKey) : '';

  const requiredModifiers = new Set(
    parts.map(part => ALIASES[part] || part),
  );

  const listener = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== key) {
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

    handler(e);
  };

  onMounted(() => {
    window.addEventListener('keydown', listener);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', listener);
  });
};
