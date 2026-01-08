<script lang="ts" setup>
import { useAiClient } from '../../composables/use-ai-client';

withDefaults(defineProps<{
  disabled?: boolean;
}>(), {
  disabled: false,
});

const model = defineModel<string | undefined>();

const { models } = useAiClient();
</script>

<template>
  <select
    v-model="model"
    class="select"
    :disabled="disabled || !models?.length"
  >
    <option
      disabled
      selected
      :value="undefined"
    >
      choose an ai model
    </option>
    <option
      v-for="item of models"
      :key="item.name"
      :value="item.name"
    >
      {{ item.name }}
    </option>
  </select>
</template>
