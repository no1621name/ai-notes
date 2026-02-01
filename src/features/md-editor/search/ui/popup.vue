<script lang="ts" setup>
import { ref, useTemplateRef, watch } from 'vue';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';
import { useI18n } from 'vue-i18n';

import { useEditor } from '@/entities/md-editor';
import { useToggleSearchPopup } from '../composables/use-toggle-search-popup';
import { useSearchReplace } from '../composables/use-search-replace';
import { useHotkey } from '@/shared/composables/use-hotkey';

const { t } = useI18n();
const { editor } = useEditor();
const { isVisible, toggle } = useToggleSearchPopup();
const {
  searchTerm,
  replaceTerm,
  caseSensitive,
  replace,
  next,
  previous,
  replaceAll,
  clear,
} = useSearchReplace(editor);

const isVisibleReplace = ref(false);
const searchInput = useTemplateRef('search-input');

watch(() => searchInput.value, () => {
  if (searchInput.value) {
    searchInput.value.focus();
  }
});

watch(isVisible, (value) => {
  if (!value) {
    clear();
  }
});

useHotkey('ctrl+f', toggle, true);
useHotkey('esc', () => {
  if (isVisible.value) {
    toggle();
  }
}, true);
</script>

<template>
  <div v-if="isVisible" class="flex gap-2 w-max bg-base-100 p-2 rounded">
    <div class="flex items-stretch">
      <button
        class="btn btn-xs text-lg btn-square h-auto"
        @click="isVisibleReplace = !isVisibleReplace"
      >
        <VueIcon :name="isVisibleReplace ? 'lu:chevron-down' : 'lu:chevron-right'" />
      </button>
      <div class="join join-vertical gap-y-0.5">
        <div class="flex join-item">
          <input
            v-model="searchTerm"
            ref="search-input"
            :placeholder="t('searchPlaceholder')"
            type="text"
            class="input input-xs w-40"
          >
          <button
            class="btn btn-xs text-lg btn-square ml-2"
            :class="{ 'btn-soft': !caseSensitive }"
            @click="caseSensitive = !caseSensitive"
          >
            <VueIcon name="lu:case-sensitive" />
          </button>
        </div>
        <div
          v-if="isVisibleReplace"
          class="flex join-item"
        >
          <input
            v-model="replaceTerm"
            :placeholder="t('replacePlaceholder')"
            class="input input-xs w-40"
            type="text"
          >

          <button
            class="btn btn-xs ml-2"
            :title="t('replace')"
            :aria-label="t('replace')"
            @click="replace"
          >
            <VueIcon name="lu:replace" />
          </button>
          <button
            class="btn btn-xs ml-1"
            :title="t('replaceAll')"
            :aria-label="t('replaceAll')"
            @click="replaceAll"
          >
            <VueIcon name="lu:replace-all" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-1 flex-wrap">
      <button
        class="btn btn-xs"
        :title="t('previous')"
        :aria-label="t('previous')"
        @click="previous"
      >
        <VueIcon name="lu:undo"/>
      </button>
      <button
        class="btn btn-xs"
        :title="t('next')"
        :aria-label="t('next')"
        @click="next"
      >
        <VueIcon name="lu:redo"/>
      </button>
      <button
        class="btn btn-xs"
        :title="t('clear')"
        :aria-label="t('clear')"
        @click="clear"
      >
        <VueIcon name="lu:trash"/>
      </button>
    </div>
  </div>
</template>

<i18n>
{
  "ru": {
    "searchPlaceholder": "Поиск",
    "replacePlaceholder": "Замена",
    "replace": "Заменить",
    "replaceAll": "Заменить все",
    "clear": "Очистить",
    "next": "Следующий",
    "previous": "Предыдущий",
    "toggleReplace": "Показать/Скрыть замену"
  },
  "en": {
    "searchPlaceholder": "Search",
    "replacePlaceholder": "Replace",
    "replace": "Replace",
    "replaceAll": "Replace all",
    "clear": "Clear",
    "next": "Next",
    "previous": "Previous",
    "toggleReplace": "Toggle replace"
  }
}
</i18n>

<style>
.search-result {
  background-color: var(--color-info-content);
}
.search-result-current {
  background-color: var(--color-info);
}
</style>
