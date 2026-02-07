<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { DEFAULT_ACTIONS } from '../model/config';

</script>

<template>
  <div class="flex gap-2 flex-wrap items-center">
    <button
      v-for="action in DEFAULT_ACTIONS"
      :key="action.id"
      class="btn btn-xs sm:btn-sm"
      disabled
    >
      <VueIcon :name="action.icon"/>
    </button>
  </div>
</template>
