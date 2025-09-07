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
  <Teleport to="body">
    <div class="absolute z-10 bottom-6 right-6 max-w-5/12 w-max min-w-2/12">
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
  </Teleport>
</template>
