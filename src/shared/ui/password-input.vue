<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { ref } from 'vue';

withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const model = defineModel<string>();
const isHidden = ref(true);
</script>

<template>
  <div class="join">
    <input
      class="join-item input"
      :type="isHidden ? 'password': 'text'"
      v-model="model"
      :disabled="disabled"
    >
    <button
      class="btn btn-square join-item"
      type="button"
      :disabled="disabled"
      @click="isHidden = !isHidden"
    >
      <VueIcon :name="isHidden ? 'lu:eye-off' : 'lu:eye'"/>
    </button>
  </div>
</template>
