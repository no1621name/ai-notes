<script lang="ts" setup>
import Button from '@/shared/ui/button.vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { DEFAULT_ACTIONS } from '../model/config';

</script>

<template>
  <div class="flex gap-2 flex-wrap items-center">
    <Button
      v-for="action in DEFAULT_ACTIONS"
      :key="action.id"
      class="btn-sm"
      disabled
    >
      <VueIcon :name="action.icon"/>
    </Button>
  </div>
</template>
