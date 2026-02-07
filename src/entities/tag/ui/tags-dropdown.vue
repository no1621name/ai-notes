<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useGetTags } from '../queries/use-get-tags';
import { useCreateTag } from '../queries/use-create-tag';
import TagBadge from './tag-badge.vue';
import TagCreationForm from './tag-form.vue';
import Dropdown from '@/shared/ui/dropdown-menu/dropdown.vue';

withDefaults(defineProps<{
  smallButton?: boolean;
  selectedTags?: string[];
}>(), {
  smallButton: false,
  selectedTags: () => [],
});

const { t } = useI18n();

const { data: tags, isPending } = useGetTags();
const { mutate: handleTagCreation } = useCreateTag();

const emit = defineEmits<{
  (e: 'tag-select', payload: { id: string }): void;
}>();
</script>

<template>
  <Dropdown
    :allowedPlacements="['right-start', 'bottom']"
    menuClass="overflow-visible"
  >
    <template #trigger="{ toggle }">
      <button
        class="btn btn-xs sm:btn-sm"
        :class="{'btn-circle': smallButton}"
        :aria-label="t('addTag')"
        :title="t('addTag')"
        @click="toggle"
      >
        <VueIcon name="lu:plus" v-if="smallButton"/>
        <template v-else>
          {{ t('addTag') }}
        </template>
      </button>
    </template>

    <div
      class="p-2 w-52"
      v-if="!isPending"
    >
      <div class="flex flex-col gap-y-2 items-stretch">
        <div
          v-if="tags?.length"
          class="flex flex-wrap gap-1 max-h-32 overflow-y-auto overflow-x-hidden"
        >
          <p v-if="tags.length === selectedTags.length" class="text-base-content/75 text-xs">
            {{ t('allTagsAdded') }}
          </p>
          <TransitionGroup v-else name="list">
            <template
              v-for="tag in tags"
              :key="tag.id"
            >
              <TagBadge
                v-if="!selectedTags.includes(tag.id)"
                :tag="tag"
                class="cursor-pointer"
                @click="() => emit('tag-select', { id: tag.id})"
              />
            </template>
          </TransitionGroup>
        </div>
        <TagCreationForm @submit="handleTagCreation"/>
      </div>
    </div>
  </Dropdown>
</template>

<i18n>
{
  "en": {
    "addTag": "Add tag",
    "allTagsAdded": "You've added all possible tags!"
  },
  "ru": {
    "addTag": "Добавить тег",
    "allTagsAdded": "Вы добавили все возможные теги!"
  }
}
</i18n>
