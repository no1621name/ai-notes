import type { NavigationGuard } from 'vue-router';
import Home from '@/pages/home/index.vue';

export const drawerDefaultComponentGuard = (depth: number = 0): NavigationGuard => (to, from) => {
  if (from.matched.length === depth + 1) {
    to.matched[depth].components!.default = from.matched[depth].components!.default;
  } else {
    to.matched[depth].components!.default = Home;
  }
};
