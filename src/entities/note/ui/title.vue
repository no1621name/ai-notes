<script lang="ts" setup>
import { computed, ref } from 'vue';
import * as z from 'zod/mini';
import type { ZodString } from 'zod';
import { useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import SkeletonRow from '@/shared/ui/skeleton-row.vue';

withDefaults(defineProps<{
  skeleton?: boolean;
}>(), {
  skeleton: false,
});

defineModel<string | null>();

const emit = defineEmits<{
  (e: 'blur'): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

defineExpose({
  focus: () => textareaRef.value?.focus(),
});

const MAX_LEN = 100;

const { value, errorMessage } = useField(
  'title',
  toTypedSchema(z.string().check(z.trim(), z.minLength(1, 'Required')) as unknown as ZodString),
  { syncVModel: true },
);

const currentLength = computed(() => value.value?.length ?? 0);

const preventTyping = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (
    event.key === 'Backspace'
    || event.key === 'Delete'
    || event.key.startsWith('Arrow')
  ) {
    return;
  }

  if (event.key === ' ' || event.key === 'Enter') {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const currentText = input.value;
    const selectionStart = input.selectionStart ?? 0;

    if (selectionStart === 0 && currentText.length === 0) {
      event.preventDefault();
      return;
    }

    if (selectionStart > 0 && (currentText[selectionStart - 1] === ' ' || currentText[selectionStart - 1] === '\n')) {
      event.preventDefault();
      return;
    }
  }

  if (currentLength.value >= MAX_LEN) {
    event.preventDefault();
    return;
  }
};

const preventPasting = (event: ClipboardEvent) => {
  event.preventDefault();

  const input = event.target as HTMLInputElement | HTMLTextAreaElement;
  const pasteText = event.clipboardData?.getData('text/plain') ?? '';
  if (!pasteText) return;

  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  const currentText = input.value;

  const availableSpace = MAX_LEN - (currentText.length - (end - start));

  if (availableSpace <= 0) return;

  const insertText = pasteText.slice(0, availableSpace);

  const newValue = currentText.slice(0, start) + insertText + currentText.slice(end);

  value.value = newValue;

  const newCursorPos = start + insertText.length;
  requestAnimationFrame(() => {
    input.setSelectionRange(newCursorPos, newCursorPos);
  });
};

</script>

<template>
  <fieldset class="relative">
    <SkeletonRow
      v-if="skeleton"
      class="pt-3 pb-6"
      :count="3"
      :height="32"
    />

    <template v-else>
      <textarea
        ref="textareaRef"
        @keydown="preventTyping"
        @paste="preventPasting"
        @blur="emit('blur')"
        v-model.trim="value"
        placeholder="Note title..."
        type="text"
        class="textarea textarea-xl textarea-ghost field-sizing-content max-h-32 min-h-0 overflow-y-auto w-full max-w-full resize-none focus:outline-0 break-all"
      />
      <div class="flex items-center flex-wrap mt-1">
        <p v-if="!!errorMessage" class="mr-auto text-error text-sm">{{errorMessage}}</p>
        <span class="select-none text-base-content/50 text-sm ml-auto">{{currentLength}}/{{MAX_LEN}}</span>
      </div>
    </template>
  </fieldset>
</template>
