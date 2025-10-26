<script setup lang="ts">
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import Button from '@/shared/ui/button.vue';
import type { EditorInstanceType } from '../model/types';
import { useGetQuickActions } from '../queries/use-get-quick-actions';
import { DEFAULT_ACTIONS } from '../model/config';

defineProps<{
  editor?: EditorInstanceType;
}>();

const { data: quickActions } = useGetQuickActions();
</script>

<template>
  <div>
    <Button
      popovertarget="formatting-popover"
      style="anchor-name:--formatting-anchor"
      class="btn-sm btn-ghost"
    >
      Styles
    </Button>
    <ul
      popover
      class="dropdown menu mt-2 bg-base-200 rounded-box z-1 w-max p-0 shadow-sm max-h-40"
      id="formatting-popover"
      style="position-anchor:--formatting-anchor"
    >
      <li
        class="p-0 mt-0 mb-0 first-of-type:[&>*]:rounded-t-box last-of-type:[&>*]:rounded-b-box"
        v-for="action in DEFAULT_ACTIONS"
        :key="action.id"
        @click="() => action.action(editor!)"
      >
        <a :class="{'no-underline flex items-center justify-between': true, 'menu-active cursor-pointer': action.isActive(editor!)}">
          <span class="flex items-center gap-x-1">
            <VueIcon :name="action.icon" />
            {{ action.label }}
          </span>

          <slot
            name="option"
            v-bind="{
              ...action,
              isQuickActionSelected: !!quickActions?.some(quickAction => quickAction?.id === action.id)
            }"
          ></slot>
        </a>
      </li>
    </ul>
  </div>
</template>
