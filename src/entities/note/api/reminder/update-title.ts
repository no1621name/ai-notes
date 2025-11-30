import { supabase } from '@/shared/api/supabase/client';
import { getVisitorId } from '@/shared/lib/fingertipjs/get-visitor-id';

export const updateReminderTitle = async (noteId: string, title: string) => {
  const fingertip = await getVisitorId();

  const { error } = await supabase.functions.invoke('send-web-notifications', {
    body: {
      action: 'update-title',
      note_id: noteId,
      fingertip,
      title,
    },
  });

  if (error) throw error;
};
