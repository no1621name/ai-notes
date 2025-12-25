<script setup lang="ts">
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { DEFAULT_FORMATTING_ACTIONS } from '../model/config';
import Dropdown from '@/shared/ui/dropdown-menu/dropdown.vue';
import DropdownMenuItem from '@/shared/ui/dropdown-menu/item.vue';

import { useEditor } from '@/entities/md-editor';

const { editor } = useEditor();
</script>

<template>
  <div v-if="editor">
    <Dropdown>
      <template #trigger="options">
        <slot name="trigger" v-bind="options"/>
      </template>
      <template #default>
        <DropdownMenuItem
          v-for="action in DEFAULT_FORMATTING_ACTIONS"
          :key="action.id"
          @click="action.action(editor)"
        >
          <a :class="{'no-underline flex items-center justify-between': true, 'menu-active cursor-pointer': action.isActive(editor)}">
            <span class="flex items-center gap-x-1">
              <VueIcon :name="action.icon" />
              {{ action.label }}
            </span>

            <slot
              name="option"
              v-bind="action"
            />
          </a>
        </DropdownMenuItem>
      </template>
    </Dropdown>
  </div>
</template>
