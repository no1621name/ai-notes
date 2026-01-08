<script lang="ts" setup>
import { useAiHelper } from '../composables/use-ai-helper';

const { toggleAiHelper } = useAiHelper();
</script>

<template>
  <button class="btn btn-soft btn-sm" @click.stop="toggleAiHelper">
    AI helper
  </button>
</template>
