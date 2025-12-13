<script setup lang="ts">
import { useToasterStore } from '@/app/stores/toaster';
import Toaster from '@/shared/ui/toaster/toaster.vue';

const store = useToasterStore();
</script>

<template>
  <Toaster :items="store.toasts" @close="store.remove" />
</template>
