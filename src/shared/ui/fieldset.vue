<script lang="ts" setup>
withDefaults(defineProps<{
  disabled?: boolean;
  legend?: string;
}>(), {
  disabled: false,
  legend: '',
});
</script>

<template>
  <fieldset class="fieldset bg-base-200 border border-base-300 rounded-box p-4 relative" :disabled="disabled">
    <legend v-if="legend" class="fieldset-legend">
      {{ legend }}
    </legend>
    <slot/>
  </fieldset>
</template>
