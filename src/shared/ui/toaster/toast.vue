<script lang="ts" setup>
import { computed } from 'vue';

export type ToastVariant = 'default' | 'success' | 'danger';

const props = withDefaults(defineProps<{ variant?: ToastVariant; closable?: boolean }>(), {
  variant: 'default',
  closable: true,
});

const emit = defineEmits(['close']);

const variantClasses: Record<ToastVariant, string> = {
  danger: 'bg-red-50 border-red-500 text-red-700',
  default: 'bg-blue-50 border-blue-500 text-blue-700',
  success: 'bg-green-100 border-green-500 text-green-700',
};

const variantStyle = computed(() => variantClasses[props.variant]);
</script>

<template>
  <div
    :class="`cursor-pointer mt-2 flex flex-col items-start p-4 border-l-4 rounded shadow-sm ${variantStyle}`"
    @click="() => emit('close')"
  >
    <p class="text-2xl"><slot name="title" /></p>
    <p><slot /></p>
  </div>
</template>
