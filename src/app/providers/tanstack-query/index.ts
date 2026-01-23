import type { App } from 'vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { broadcastQueryClient } from '@/shared/lib/tanstack-query/broadcast';

export const setupQuery = (app: App) => {
  const queryClient = new QueryClient();

  broadcastQueryClient(queryClient);

  app.use(VueQueryPlugin, { queryClient });

  return queryClient;
};
