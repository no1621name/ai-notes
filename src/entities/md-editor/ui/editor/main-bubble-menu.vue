<script lang="ts" setup>
import BubbleMenu from '../base/bubble-menu.vue';
import FormattingDropdown from '../formatting/formatting-dropdown.vue';
import QuickActions from '../quick-actions/quick-actions.vue';
import QuickActionToggler from '../quick-actions/quick-action-toggler.vue';
</script>

<template>
  <BubbleMenu>
    <div class="flex items-center gap-2">
      <FormattingDropdown>
        <template #option="{ id, isQuickActionSelected }">
          <QuickActionToggler
            :action-id="id"
            :is-selected="isQuickActionSelected"
          />
        </template>
      </FormattingDropdown>

      <QuickActions/>
    </div>
  </BubbleMenu>
</template>
