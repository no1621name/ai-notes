<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { Toaster } from '@/app/providers/toasts';
import Header from '@/widgets/layout/header.vue';
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-screen">
    <Header />
    <div class="grow min-h-full w-full">
      <RouterView class="m-3"/>
    </div>

    <RouterView name="drawer" v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
  <Toaster />
  <VueQueryDevtools />
</template>
