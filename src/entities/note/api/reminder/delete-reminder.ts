import { supabase } from '@/shared/api/supabase/client';

export const deleteReminder = async (noteId: string) => {
  const { error } = await supabase.functions.invoke('send-web-notifications', {
    body: {
      action: 'delete',
      note_id: noteId,
    },
  });

  if (error) throw error;
};
