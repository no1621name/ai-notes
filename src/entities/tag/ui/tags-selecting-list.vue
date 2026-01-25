<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

import type { Tag } from '../model/types';
import { useGetTags } from '../queries/use-get-tags';
import { useCreateTag } from '../queries/use-create-tag';
import TagBadge from './tag-badge.vue';
import TagForm from './tag-form.vue';

withDefaults(defineProps<{
  selectedTags?: Tag['id'][];
  isFetching?: boolean;
}>(), {
  selectedTags: () => [],
});

defineEmits<{
  (e: 'tag-select', id: Tag['id']): void;
}>();

const { t } = useI18n();
const { data, isLoading } = useGetTags();
const { mutate: handleTagCreation } = useCreateTag();
const showTagForm = ref(false);
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center">
    <template v-if="isLoading">
      <div
        v-for="i in 5"
        :key="i"
        class="badge skeleton w-14"
      />
    </template>
    <template v-else>
      <TagBadge
        v-for="tag in data"
        :key="tag.id"
        :tag="tag"
        :outline="!selectedTags.includes(tag.id)"
        :class="{'cursor-pointer': !isFetching, 'pointer-events-none': isFetching}"
        @click="$emit('tag-select', tag.id)"
      />

      <button
        v-if="!showTagForm"
        class="btn"
        :class="{'btn-circle btn-sm': data?.length, 'btn-xs': !data?.length}"
        :aria-label="t('createTag')"
        :title="t('createTag')"
        @click="showTagForm = true"
      >
        <span v-if="!data?.length">
          {{ t('createTag') }}
        </span>
        <VueIcon v-else name="lu:plus"/>
      </button>

      <TagForm
        v-if="showTagForm"
        class="w-60"
        :autoclose="false"
        @submit="handleTagCreation"
        @close="showTagForm = false"
      />
    </template>
  </div>
</template>

<i18n>
{
  "en": {
    "createTag": "Create tag"
  },
  "ru": {
    "createTag": "Создать тег"
  }
}
</i18n>
