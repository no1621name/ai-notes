<script lang="ts" setup>
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import Modal from '@/shared/ui/modal.vue';
import SettingsForm from './settings/settings-form.vue';
import SavedPromptsList from './saved-prompts/list.vue';
</script>

<template>
  <Modal>
    <template #trigger="{ toggle }">
      <button
        title="Open settings"
        aria-label="Open settings"
      >
        <VueIcon

          name="lu:settings"
          class="text-2xl cursor-pointer"
          @click="toggle"
        />
      </button>
    </template>
    <template #content>
      <SettingsForm/>
      <SavedPromptsList/>
    </template>
  </Modal>
</template>
