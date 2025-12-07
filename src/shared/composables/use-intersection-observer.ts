import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export const useIntersectionObserver = (
  target: Ref<HTMLElement | null | undefined>,
  callback?: () => void,
) => {
  const isIntersecting = ref(false);
  let observer: IntersectionObserver | undefined;

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting;
      if (entry && entry.isIntersecting) {
        callback?.();
      }
    });

    if (target.value) {
      observer.observe(target.value);
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return {
    isIntersecting,
  };
};
