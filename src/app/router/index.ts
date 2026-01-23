import { createRouter, createWebHistory } from 'vue-router';

import { drawerDefaultComponentGuard, i18nGuard } from './guards';
import { getLocale, isAvailableLocale, type I18nInstance, type AvailableLocale, BROADCAST_EVENT } from '../providers/i18n';
import Home from '@/pages/home.vue';
import NoteDetails from '@/pages/note/details.vue';
import NewNote from '@/pages/note/new.vue';
import Info from '@/pages/info.vue';
import { onBroadcastMessage } from '@/shared/lib/broadcast';
import Drawer from '@/shared/ui/drawer/main.vue';

export const setupRouter = (i18n: I18nInstance) => {
  const locale = getLocale(i18n);

  const routes = [
    {
      path: '/:pathMatch(.*)*',
      redirect: () => `/${locale}`,
    },
    {
      path: '/:locale/',
      component: Home,
      name: 'home',
    },
    {
      path: '/:locale/info',
      component: Info,
      name: 'info',
    },
    {
      path: '/:locale/note',
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
  ];

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  });

  router.beforeResolve(i18nGuard(i18n, locale));

  onBroadcastMessage<AvailableLocale>(BROADCAST_EVENT, (payload) => {
    const currentRoute = router.currentRoute.value;
    const currentLocale = currentRoute.params.locale;

    if (isAvailableLocale(payload) && currentLocale !== payload && currentRoute.name) {
      router.replace({
        name: currentRoute.name,
        params: {
          ...currentRoute.params,
          locale: payload,
        },
        query: currentRoute.query,
        hash: currentRoute.hash,
      });
    }
  });

  return router;
};
