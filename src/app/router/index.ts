import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/home/index.vue';
import Modal from '@/pages/modal.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/modal',
      components: {
        modal: Modal,
      },
      beforeEnter: [
        (to, from) => {
          console.log(to);
          if (from.matched.length) {
            to.matched[0].components!.default = from.matched[0].components!.default;
          } else {
            to.matched[0].components!.default = Home;
          }
        },
      ],
    },
  ],
});

export default router;
