import { supabase } from '@/shared/api/supabase/client';
import { getVisitorId } from '@/shared/lib/fingertipjs/get-visitor-id';
import { getAppServerKey } from './get-app-server-key';

export const registerPush = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register('/reminder-service-worker.js');
    const registration = await navigator.serviceWorker.ready;

    const applicationServerKey = getAppServerKey();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    const sub = JSON.parse(JSON.stringify(subscription));
    const fingertip = await getVisitorId();

    await supabase.functions.invoke('send-web-notifications', {
      body: {
        action: 'register',
        fingertip,
        endpoint: sub.endpoint,
        keys: sub.keys,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to setup notifications');
  }
};
