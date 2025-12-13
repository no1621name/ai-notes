<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import BaseCard from './base-card.vue';
</script>

<template>
  <BaseCard
    :to="{
      name: 'note-create'
    }"
    class="transition-shadow shadow-xl hover:shadow-accent-content"
  >
    <h2 class="card-title break-all m-auto">
      <VueIcon name="lu:circle-plus"/>
      Create new note
    </h2>
  </BaseCard>
</template>
