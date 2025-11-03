<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import Header from '@/shared/ui/header.vue';
import Notifications from '@/app/providers/notifications/ui.vue';
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-screen">
    <Header />
    <div class="grow min-h-0 w-full h-max">
      <RouterView />
    </div>

    <RouterView name="drawer" v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
  <Notifications />
  <VueQueryDevtools />
</template>
