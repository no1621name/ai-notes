import { supabase } from '@/shared/api/supabase/client';
import { getVisitorId } from '@/shared/lib/fingertipjs/get-visitor-id';

export const setReminder = async (noteId: string, date: string, title: string) => {
  const fingertip = await getVisitorId();

  const { error } = await supabase.functions.invoke('send-web-notifications', {
    body: {
      action: 'schedule',
      note_id: noteId,
      fingertip,
      title,
      send_at: date,
    },
  });

  if (error) throw error;
};
