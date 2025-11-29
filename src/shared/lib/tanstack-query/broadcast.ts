import type { DefaultError, QueryClient, QueryState } from '@tanstack/vue-query';
import { onBroadcastMessage, sendBroadcastMessage } from '../broadcast';

type AvailableEvent = typeof AVAILABLE_EVENTS[number];

interface BroadcastQueryClientEvent {
  type: AvailableEvent;
  queryHash: string;
  queryKey: string[];
  state?: QueryState<unknown, DefaultError>;
}

const AVAILABLE_EVENTS = ['updated', 'added', 'removed'] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAvailableEvent = (event: any): event is AvailableEvent => AVAILABLE_EVENTS.includes(event);

export const broadcastQueryClient = (queryClient: QueryClient) => {
  const queryCache = queryClient.getQueryCache();

  let transaction = false;
  const makeTransaction = (cb: () => void) => {
    transaction = true;
    cb();
    transaction = false;
  };

  queryClient.getQueryCache().subscribe((event) => {
    if (transaction) {
      return;
    }

    const { queryHash, queryKey, state, observers } = event.query;

    if (!isAvailableEvent(event.type)) {
      return;
    }

    const body: BroadcastQueryClientEvent = {
      type: event.type,
      queryHash,
      queryKey,
    };

    if ((event.type === 'updated' && event.action.type === 'success') || event.type === 'added') {
      body.state = state;
    }

    if (event.type === 'removed' && observers.length <= 0) {
      return;
    }

    sendBroadcastMessage('tanstack-query', body);
  });

  const removeHandler = onBroadcastMessage('tanstack-query', (event: BroadcastQueryClientEvent) => {
    if (!event.type || !isAvailableEvent(event.type)) {
      return;
    }

    makeTransaction(() => {
      const { type, queryHash, queryKey, state } = event;

      const query = queryCache.get(queryHash);

      if (type === 'removed') {
        if (query) {
          queryCache.remove(query);
        }

        return;
      }

      if (query && !!state?.data) {
        query.setState(state);
      }

      queryCache.build(
        queryClient,
        {
          queryKey,
          queryHash,
        },
        state,
      );
    });
  });

  return () => {
    removeHandler();
  };
};
