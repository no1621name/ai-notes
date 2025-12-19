import { type Ref, ref, watch } from 'vue';

export const useBufferModel = <T>(model: Ref<T>) => {
  const buffer = ref(model.value) as Ref<T>;

  watch(model, (v) => {
    if (!buffer.value) {
      buffer.value = v;
    }
  });

  watch(buffer, v => (model.value = v));

  return buffer;
};
