<script setup lang="ts">
import { onMounted, onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import VueIcon from '@kalimahapps/vue-icons/VueIcon';

const router = useRouter();
const show = ref(false);
let closing = false;

onMounted(() => {
  show.value = true;
});

onActivated(() => {
  show.value = true;
  closing = false;
});

function hide() {
  show.value = false;
}

async function afterLeave() {
  if (closing) return;
  closing = true;
  router.back();
}
</script>

<template>
  <div class="fixed inset-0 z-50 pointer-events-none">
    <Transition name="fade">
      <button
        v-if="show"
        class="absolute inset-0 bg-black/40 pointer-events-auto"
        @click="hide"
        aria-label="Закрыть модльное окно"
      />
    </Transition>

    <Transition name="slide-right" @after-leave="afterLeave">
      <aside
        v-if="show"
        class="absolute right-0 top-0 h-full w-5/6 sm:w-3/4 lg:w-1/2 max-w-[90vw] bg-base-200 shadow-2xl pointer-events-auto"
        role="dialog"
        aria-modal="true"
      >
        <header class="p-4 border-b border-b-base-300 relative">
          <div class="max-w-[90%]">
            <slot name="header" />
          </div>
          <button class="absolute top-4 right-4 cursor-pointer" @click="hide">
            <VueIcon name="lu:x" />
          </button>
        </header>
        <main class="p-4 overflow-auto">
          <slot />
        </main>
      </aside>
    </Transition>
  </div>
</template>
