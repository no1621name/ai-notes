import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import * as webpush from 'jsr:@negrel/webpush';

const vapidJwk = JSON.parse(Deno.env.get('VAPID_JWK')!);
const vapidKeys = await webpush.importVapidKeys(vapidJwk);

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  if (req.method === 'POST') {
    try {
      const body = await req.json();

      if (body.action === 'register') {
        if (body.endpoint && body.keys && body.fingertip) {
          const { error } = await supabase
            .from('push_subscriptions')
            .upsert(
              {
                fingertip: body.fingertip,
                endpoint: body.endpoint,
                p256dh: body.keys.p256dh,
                auth: body.keys.auth,
              },
              { onConflict: 'endpoint', ignoreDuplicates: true },
            );

          if (error) {
            return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });
          }

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      } else if (body.action === 'schedule') {
        if (body.note_id && body.fingertip && body.send_at && body.title) {
          const { error } = await supabase
            .from('scheduled_notifications')
            .upsert(
              {
                note_id: body.note_id,
                fingertip: body.fingertip,
                title: body.title,
                send_at: body.send_at,
                status: 'pending',
              },
              { onConflict: 'note_id' },
            );

          if (error) {
            return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });
          }

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      } else if (body.action === 'delete') {
        if (body.note_id) {
          const { error } = await supabase
            .from('scheduled_notifications')
            .delete()
            .eq('note_id', body.note_id);

          if (error) {
            return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });
          }

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      } else if (body.action === 'update-title') {
        if (body.note_id && body.title) {
          const { error } = await supabase
            .from('scheduled_notifications')
            .update({ title: body.title })
            .eq('note_id', body.note_id);

          if (error) {
            return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });
          }

          return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
        }
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'Unknown action or missing fields' }), { status: 400, headers: corsHeaders });
  }

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
      .eq('fingertip', n.fingertip);

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
          note_id: n.note_id,
        }), {});
    }

    await supabase
      .from('scheduled_notifications')
      .update({ status: 'sent' })
      .eq('id', n.id);
  }

  return new Response('Notifications sent');
});
