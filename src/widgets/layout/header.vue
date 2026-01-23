<script setup lang="ts">
import SettingsModal from '@/features/settings/modal.vue';
import Header from '@/shared/ui/header.vue';
</script>

<template>
  <Header>
    <template #actions>
      <SettingsModal/>
    </template>
  </Header>
</template>
