import { type Ref } from 'vue';
import { useUpdateNote } from '../../queries/use-update-note';

export const useUpdateReminder = (noteId: Ref<string>) => {
  const { mutate, isPending } = useUpdateNote(noteId);

  const updateReminder = (date: string, title = 'Reminder') => {
    if (!date) {
      mutate({
        body: {
          reminder_date: null,
        },
      });
    } else {
      const selectedDate = new Date(date);
      mutate({
        body: {
          reminder_date: selectedDate,
        },
        reminderTitle: title,
      });
    }
  };

  return {
    updateReminder,
    isLoading: isPending,
  };
};
