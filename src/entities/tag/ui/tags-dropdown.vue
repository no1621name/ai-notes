<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import { useGetTags } from '../queries/use-get-tags';
import { useCreateTag } from '../queries/use-create-tag';
import TagBadge from './tag-badge.vue';
import TagCreationForm from './tag-form.vue';

withDefaults(defineProps<{
  smallButton?: boolean;
  selectedTags?: string[];
}>(), {
  smallButton: false,
  selectedTags: () => [],
});

const { t } = useI18n();

const { data: tags, isPending } = useGetTags();
const { mutateAsync: createTag } = useCreateTag();

const emit = defineEmits<{
  (e: 'tag-select', payload: { id: string }): void;
}>();

const handleTagCreation = async (payload: Record<'name' | 'color', string>) => {
  await createTag(payload);
};
</script>

<template>
  <div>
    <button
      class="btn btn-sm"
      :class="{'btn-circle': smallButton}"
      :title="t('actions.add')"
      :aria-label="t('actions.add')"
    >
      <VueIcon name="lu:plus" v-if="smallButton"/>
      <template v-else>
        {{ t('actions.add') }}
      </template>
    </button>

    <div
      popover
      id="tags-dropdown"
      style="position-anchor:--anchor-tags-dropdown"
      class="dropdown dropdown-end overflow-hidden mt-1 p-2 rounded-box bg-base-200 shadow-sm w-52"
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
  </div>
</template>

<i18n>
{
  "en": {
    "allTagsAdded": "You've added all possible tags!"
  },
  "ru": {
    "allTagsAdded": "Вы добавили все возможные теги!"
  }
}
</i18n>
