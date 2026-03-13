<script lang="ts" setup>
import { ref, watch, type ComponentPublicInstance } from 'vue';
import { i18n } from '@/app/providers/i18n';
import type { RendererComponentProps } from '../../lib/extensions/commands';
import DropdownMenu from '@/shared/ui/dropdown-menu/menu.vue';
import DropdownMenuItem from '@/shared/ui/dropdown-menu/item.vue';

const props = defineProps<RendererComponentProps>();

const itemRefs = ref<ComponentPublicInstance[]>([]);
const selectedIndex = ref(0);

watch(() => props.items, () => {
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
  <DropdownMenu class="p-1 gap-y-0.5 max-h-40 overflow-auto flex-nowrap" v-if="i18n.global">
    <template v-if="items.length">
      <DropdownMenuItem
        v-for="(item, index) in items"
        class="btn btn-sm sm:btn-xs px-2 min-w-max"
        :key="item.id"
        :ref="el => itemRefs[index] = el as ComponentPublicInstance"
        :class="{ 'btn-primary': index === selectedIndex }"
        @click="selectItem(index)"
      >
        {{ i18n.global.t(item.label) }}
      </DropdownMenuItem>
    </template>
    <DropdownMenuItem v-else>
      <p class="text-ellipsis max-w-80">
        <span class="line-clamp-1">
          {{ i18n.global.t('noResultsFor', { query: props.query }) }}
        </span>
      </p>
    </DropdownMenuItem>
  </DropdownMenu>
</template>
