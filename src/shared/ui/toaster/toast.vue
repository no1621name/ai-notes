<script lang="ts" setup>
import { computed } from 'vue';

export type ToastVariant = 'default' | 'success' | 'danger';

const props = withDefaults(defineProps<{ variant?: ToastVariant; closable?: boolean }>(), {
  variant: 'default',
  closable: true,
});

const emit = defineEmits(['close']);

const variantClasses: Record<ToastVariant, string> = {
  danger: 'alert-error',
  default: 'alert-info',
  success: 'alert-success',
};

const variantStyle = computed(() => variantClasses[props.variant]);
</script>
<template>
  <div
    role="alert"
    :class="`alert alert-vertical sm:alert-horizontal ${variantStyle}`"
    @click="() => emit('close')"
  >
    <div>
      <h3 class="font-bold"><slot name="title" /></h3>
      <div class="text-xs"><slot /></div>
    </div>
  </div>
</template>
