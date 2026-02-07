<script setup lang="ts">
import SettingsModal from '@/features/settings/modal.vue';
import { CreateNoteButton } from '@/entities/note';
import Header from '@/shared/ui/header.vue';
import { useIsMobile } from '@/shared/composables/use-media-query';

const isMobile = useIsMobile();
</script>

<template>
  <Header>
    <template #actions>
      <CreateNoteButton v-if="isMobile" />
      <SettingsModal/>
    </template>
  </Header>
</template>
