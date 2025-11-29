import { type Ref } from 'vue';
import { useUpdateNote } from '../../queries/use-update-note';

export const useUpdateReminder = (noteId: Ref<string>) => {
  const { mutate } = useUpdateNote(noteId);

  const updateReminder = (date: string) => {
    if (!date) {
      mutate({
        reminder_date: null,
      });
      return;
    }

    const selectedDate = new Date(date);

    mutate({
      reminder_date: selectedDate,
    });
  };

  return {
    updateReminder,
  };
};
