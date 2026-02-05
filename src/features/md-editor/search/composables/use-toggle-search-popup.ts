import { ref } from 'vue';

const isVisible = ref(false);

export const useToggleSearchPopup = () => {
  const toggle = () => {
    isVisible.value = !isVisible.value;
  };

  return {
    isVisible,
    toggle,
  };
};
