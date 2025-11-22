import { useQueryClient } from '@tanstack/vue-query';
import { tagsOptions } from './use-get-tags';
import { notesOptions } from '@/entities/note/@x/tag';

export const useInvalidateTags = () => {
  const queryClient = useQueryClient();

  return {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tagsOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: notesOptions.queryKey });
    },
  };
};
