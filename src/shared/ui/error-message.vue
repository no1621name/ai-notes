<script lang="ts" setup>
import type { RegleFieldStatus } from '@regle/core';
import type { RegleSchemaFieldStatus } from '@regle/schemas';

defineProps<{
  state?: RegleFieldStatus | RegleSchemaFieldStatus;
  message?: string;
}>();
</script>

<template>
  <span
    v-if="state?.$error || state?.$externalErrors?.length || message"
    class="text-sm text-red-400"
  >
    {{ state?.$errors[0] || state?.$externalErrors?.[0] || message }}
  </span>
</template>
