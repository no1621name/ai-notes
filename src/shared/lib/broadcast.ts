export const BROADCAST_CHANNEL_NAME = 'ai-notes-app';

const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

export interface BroadcastMessage<T = unknown> {
  type: string;
  payload?: T;
}

export const sendBroadcastMessage = <T = unknown>(type: string, payload?: T) => {
  channel.postMessage({ type, payload });
};

export const onBroadcastMessage = <T = unknown>(
  targetType: string,
  callback: (payload: T) => void,
) => {
  const handler = (event: MessageEvent<BroadcastMessage<T>>) => {
    if (event.data?.type === targetType) {
      callback(event.data.payload as T);
    }
  };

  channel.addEventListener('message', handler);

  return () => {
    channel.removeEventListener('message', handler);
  };
};
