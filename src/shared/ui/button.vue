<script lang="ts" setup>
import { computed } from 'vue';

export type ButtonVarinats = 'primary' | 'secondary' | 'error' | 'success' | 'white';
type ButtonSizes = 'default' | 'icon' | 'large';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVarinats;
    size?: ButtonSizes;
  }>(),
  {
    variant: 'primary',
    size: 'default',
  },
);

const variantClasses: Record<ButtonVarinats, string> = {
  white: 'text-dark-400 bg-white hover:bg-gray-100',
  success: 'text-white bg-green-500 hover:bg-green-600',
  error: 'text-white bg-red-500 hover:bg-red-700',
  secondary: 'text-white bg-dark-500 hover:bg-dark-400',
  primary: 'text-white bg-blue-500 hover:bg-blue-600',
};

const sizeClases: Record<ButtonSizes, string> = {
  large: 'px-4 py-2 text-xl rounded-md',
  icon: 'p-2 rounded',
  default: 'px-4 py-2 text-base rounded',
};

const variantStyle = computed(() => variantClasses[props.variant]);
const sizeStyle = computed(() => sizeClases[props.size]);
</script>

<template>
  <button
    :class="`cursor-pointer block transition duration-150 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${variantStyle} ${sizeStyle}`"
  >
    <slot />
  </button>
</template>
