<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

withDefaults(defineProps<{
  showCloseButton?: boolean;
}>(),
{
  showCloseButton: true,
});

const isOpen = defineModel<boolean>({
  default: false,
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close();
};

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <slot name="trigger" :toggle="toggle" />

  <Teleport to="body">
    <div
      class="modal sm:modal-middle modal-bottom"
      :class="{ 'modal-open': isOpen }"
      @click.self="close"
    >
      <div class="modal-box relative">
        <button
          v-if="showCloseButton"
          class="btn btn-square btn-ghost text-lg absolute top-2 right-2"
          @click="close"
        >
          <VueIcon name="lu:x"/>
        </button>
        <slot name="content" :close="close" />
      </div>
    </div>
  </Teleport>
</template>
