import { useQueryClient } from '@tanstack/vue-query';

export const useInvalidateTags = () => {
  const queryClient = useQueryClient();

  return {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  };
};
