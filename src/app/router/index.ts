import { createRouter, createWebHistory } from 'vue-router';

import { drawerDefaultComponentGuard } from './guards';

import Home from '@/pages/home/index.vue';
import NoteDetails from '@/pages/notes/details.vue';
import NewNote from '@/pages/notes/new.vue';
import Drawer from '@/shared/ui/drawer/main.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/note',
      components: {
        drawer: Drawer,
      },
      children: [
        {
          path: ':id',
          components: {
            'drawer-content': NoteDetails,
          },
          beforeEnter: [drawerDefaultComponentGuard()],
        },
        {
          path: 'new',
          components: {
            'drawer-content': NewNote,
          },
          beforeEnter: [drawerDefaultComponentGuard()],
        },
      ],
    },
  ],
});

export default router;
