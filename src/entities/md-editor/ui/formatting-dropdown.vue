<script setup lang="ts">
import { inject } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { DEFAULT_FORMATTING_ACTIONS } from '../model/config';
import { editorInjectionKey } from '../model/keys';
import { useGetQuickActions } from '../queries/use-get-quick-actions';
import Button from '@/shared/ui/button.vue';

const editorRef = inject(editorInjectionKey);
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
        v-for="action in DEFAULT_FORMATTING_ACTIONS"
        :key="action.id"
        @click="() => action.action(editorRef?.editor!)"
      >
        <a :class="{'no-underline flex items-center justify-between': true, 'menu-active cursor-pointer': action.isActive(editorRef?.editor!)}">
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
