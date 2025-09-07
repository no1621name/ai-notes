<script lang="ts" setup>
import Header from '@/shared/ui/header.vue';
import Notifications from '@/app/providers/notifications/ui.vue';
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-screen">
    <Header/>
    <FaAngleDown/>
    <FaArrowDown/>
    <div class="flex grow min-h-0 w-full h-max">
      <RouterView/>
    </div>
  </div>
  <Notifications />
</template>
