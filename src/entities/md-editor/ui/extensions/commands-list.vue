<script lang="ts" setup>
import { ref, watch, type ComponentPublicInstance } from 'vue';
import type { RendererComponentProps } from '../../lib/extensions/commands';
import DropdownMenu from '@/shared/ui/dropdown-menu/menu.vue';
import DropdownMenuItem from '@/shared/ui/dropdown-menu/item.vue';

const props = defineProps<RendererComponentProps>();

const itemRefs = ref<ComponentPublicInstance[]>([]);
const selectedIndex = ref(0);

watch(props.items, () => {
  selectedIndex.value = 0;
  itemRefs.value = [];
});

watch(selectedIndex, (index) => {
  const item = itemRefs.value[index];
  if (item?.$el instanceof HTMLElement) {
    item.$el.scrollIntoView({ block: 'nearest' });
  }
});

const onKeyDownHandler = ({ event }: { event: KeyboardEvent }) => {
  switch (event.key) {
    case 'ArrowUp':
      selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length;
      return true;
    case 'ArrowDown':
      selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
      return true;
    case 'Enter':
      selectItem(selectedIndex.value);
      return true;
  }

  return false;
};

const selectItem = (index: number) => {
  const item = props.items[index];

  if (item) {
    props.command(item);
  }
};

defineExpose({
  onKeyDownHandler,
});
</script>

<template>
  <DropdownMenu class="p-1 gap-y-0.5 max-h-40 overflow-auto flex-nowrap">
    <template v-if="items.length">
      <DropdownMenuItem
        v-for="(item, index) in items"
        :key="item.id"
        :ref="el => itemRefs[index] = el as ComponentPublicInstance"
        @click="selectItem(index)"
        class="btn btn-xs px-1"
        :class="{ 'btn-primary': index === selectedIndex }"
      >
        {{ item.label }}
      </DropdownMenuItem>
    </template>
    <DropdownMenuItem v-else>No result</DropdownMenuItem>
  </DropdownMenu>
</template>
