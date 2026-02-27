export const BROADCAST_CHANNEL_NAME = 'ai-notes-app';

let channel: BroadcastChannel | null = null;

const getChannel = (): BroadcastChannel => {
  if (!channel) {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
  return channel;
};

export interface BroadcastMessage<T = unknown> {
  type: string;
  payload?: T;
}

export const sendBroadcastMessage = <T = unknown>(type: string, payload?: T) => {
  getChannel().postMessage({ type, payload });
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

  getChannel().addEventListener('message', handler);

  return () => {
    getChannel().removeEventListener('message', handler);
  };
};
