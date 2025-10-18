import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/home/index.vue';
import Drawer from '@/pages/drawer.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/drawer',
      components: {
        drawer: Drawer,
      },
      beforeEnter: [
        (to, from) => {
          if (from.matched.length) {
            to.matched[0].components!.default = from.matched[0].components!.default;
          } else {
            to.matched[0].components!.default = Home;
          }

          console.log()
        },
      ],
    },
  ],
});

export default router;
