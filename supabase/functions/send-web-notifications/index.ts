import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import * as webpush from 'jsr:@negrel/webpush';

const vapidJwk = JSON.parse(Deno.env.get('VAPID_JWK')!);
const vapidKeys = await webpush.importVapidKeys(vapidJwk);

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: notifications } = await supabase
    .from('scheduled_notifications')
    .select('*')
    .eq('status', 'pending')
    .lte('send_at', new Date().toISOString());

  if (!notifications?.length) return new Response('No notifications');

  for (const n of notifications) {
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', n.user_id);

    if (!subs?.length) continue;

    const webPush = await webpush.ApplicationServer.new({
      contactInformation: 'mailto:admin@example.com',
      vapidKeys: vapidKeys,
    });

    for (const sub of subs) {
      await webPush
        .subscribe({
          endpoint: sub.endpoint,
          keys: { auth: sub.auth, p256dh: sub.p256dh },
        })
        .pushTextMessage(JSON.stringify({
          title: n.title,
          body: n.body,
        }), {});
    }

    await supabase
      .from('scheduled_notifications')
      .update({ status: 'sent' })
      .eq('id', n.id);
  }

  return new Response('Notifications sent');
});
