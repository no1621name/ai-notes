<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { RouterLink } from 'vue-router';
</script>

<template>
  <RouterLink
    :to="{
      name: 'note-create'
    }"
    class="card bg-base-200 hover:shadow-accent-content shadow-xl h-full transition-shadow"
  >
    <div class="card-body items-center justify-center">
      <h2 class="card-title break-all"><VueIcon name="lu:circle-plus"/> Create new note</h2>
    </div>
  </RouterLink>
</template>
