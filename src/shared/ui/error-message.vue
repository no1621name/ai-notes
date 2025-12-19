<script lang="ts" setup>
import type { RegleFieldStatus } from '@regle/core';
import type { RegleSchemaFieldStatus } from '@regle/schemas';

defineProps<{
  state?: RegleFieldStatus | RegleSchemaFieldStatus;
}>();
</script>

<template>
  <span v-if="state?.$error" class="text-sm text-red-400">{{ state.$errors[0] }}</span>
</template>
