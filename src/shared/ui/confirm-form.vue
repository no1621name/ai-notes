<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  mode?: 'error' | 'success' | 'primary';
}>(), {
  mode: 'primary',
});

defineEmits<{
  (e: 'submit'): void;
  (e: 'close'): void;
}>();

const modes = {
  error: 'btn-error',
  success: 'btn-success',
  primary: 'btn-primary',
};

const mode = computed(() => modes[props.mode]);
</script>

<template>
  <form class="flex gap-2 bg-base-300 items-center py-1 px-2 rounded-box" @submit.prevent>
    <p class="text-xs"><slot name="message"/></p>
    <div class="flex gap-1">
      <button
        type="button"
        :class="`btn btn-xs ${mode}`"
        @click="$emit('submit')"
      >
        <slot name="submit-text"/>
      </button>
      <button
        type="button"
        class="btn btn-xs"
        @click="$emit('close')"
      >
        {{ t('actions.cancel') }}
      </button>
    </div>
  </form>
</template>
