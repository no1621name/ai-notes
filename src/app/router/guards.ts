import type { NavigationGuard } from 'vue-router';
import Home from '@/pages/home.vue';

export const drawerDefaultComponentGuard = (depth: number = 0): NavigationGuard => (to, from) => {
  const toRecord = to.matched[depth];
  const toComponents = toRecord?.components;

  if (!toComponents) {
    return;
  }

  if (from.matched.length === depth + 1) {
    const fromRecord = from.matched[depth];
    const fromComponents = fromRecord?.components;
    const fromDefault = fromComponents?.default;

    if (fromDefault) {
      toComponents.default = fromDefault;
    } else {
      toComponents.default = Home;
    }
  } else {
    toComponents.default = Home;
  }
};
