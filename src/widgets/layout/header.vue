<script setup lang="ts">
import { SettingsModal } from '@/entities/ai-client';
import Header from '@/shared/ui/header.vue';
</script>

<template>
  <Header>
    <template #actions>
      <SettingsModal/>
    </template>
  </Header>
</template>
