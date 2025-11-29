<script lang="ts" setup>
import Toast, { type ToastVariant } from './toast.vue';

interface ToastType {
  id: number;
  title: string;
  message?: string;
  type: ToastVariant;
}

defineProps<{ items: ToastType[] }>();
const emit = defineEmits<{ close: [id: ToastType['id']] }>();
</script>

<template>
  <div class="toast z-40">
    <TransitionGroup name="list">
      <Toast
        v-for="item in items"
        :key="item.id"
        :variant="item.type"
        closable
        @close="() => emit('close', item.id)"
      >
        <template #title>{{ item.title }}</template>
        <template #default v-if="!!item.message">{{ item.message }}</template>
      </Toast>
    </TransitionGroup>
  </div>
</template>
