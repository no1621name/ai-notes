<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

const { t } = useI18n();

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
  <slot name="trigger" :toggle="toggle">
    <button class="btn" @click="toggle">
      {{ t('actions.open') }}
    </button>
  </slot>

  <Teleport to="body">
    <div
      class="modal sm:modal-middle modal-bottom"
      :class="{ 'modal-open': isOpen }"
      @click.self="close"
    >
      <div class="modal-box relative p-0 flex flex-col">
        <button
          v-if="showCloseButton"
          class="btn btn-square btn-xs text-lg sticky top-1 right-1 z-1 ml-auto"
          @click="close"
          :title="t('actions.close')"
          :aria-label="t('actions.close')"
        >
          <VueIcon name="lu:x"/>
        </button>
        <div class="p-4 pt-0">
          <slot name="content" :close="close" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
