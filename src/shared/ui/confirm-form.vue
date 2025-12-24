<script lang="ts" setup>
withDefaults(defineProps<{
  mode?: 'error' | 'success' | 'primary';
}>(), {
  mode: 'primary',
});

defineEmits<{
  (e: 'submit'): void;
  (e: 'close'): void;
}>();
</script>

<template>
  <form
    class="flex gap-2 bg-base-300 items-center py-1 px-2 rounded-box"
    @submit.prevent="$emit('submit')"
  >
    <p class="text-xs"><slot name="message"/></p>
    <div class="flex gap-1">
      <button type="submit" :class="`btn btn-xs btn-${mode}`">
        <slot name="submit-text"/>
      </button>
      <button
        type="button"
        class="btn btn-xs"
        @click="$emit('close')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
