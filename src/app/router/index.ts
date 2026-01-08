import { createRouter, createWebHistory } from 'vue-router';

import { drawerDefaultComponentGuard } from './guards';

import Home from '@/pages/home.vue';
import NoteDetails from '@/pages/note/details.vue';
import NewNote from '@/pages/note/new.vue';
import Drawer from '@/shared/ui/drawer/main.vue';
import Info from '@/pages/info.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home',
    },
    {
      path: '/info',
      component: Info,
      name: 'info',
    },
    {
      path: '/note',
      components: {
        drawer: Drawer,
      },
      children: [
        {
          path: ':id',
          name: 'note-details',
          components: {
            'drawer-content': NoteDetails,
          },
          beforeEnter: [drawerDefaultComponentGuard()],
        },
        {
          path: 'new',
          name: 'note-create',
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
