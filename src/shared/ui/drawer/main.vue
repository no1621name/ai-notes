<script setup lang="ts">
import { onMounted, onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDrawerHide } from '@/shared/composables/use-drawer-hide';

const { setHide } = useDrawerHide();

const { locale, t } = useI18n();
const router = useRouter();
const show = ref(false);
let closing = false;

function hide() {
  show.value = false;
}

async function afterLeave() {
  if (closing) return;
  closing = true;
  router.push({ name: 'home', params: { locale: locale.value } });
  document.body.style.overflow = 'auto';
}

setHide(hide);

onMounted(() => {
  show.value = true;
  document.body.style.overflow = 'hidden';
});

onActivated(() => {
  show.value = true;
  closing = false;
  document.body.style.overflow = 'hidden';
});
</script>

<template>
  <div class="fixed inset-0 z-30 pointer-events-none">
    <Transition name="fade">
      <button
        v-if="show"
        class="absolute inset-0 bg-black/40 pointer-events-auto"
        @click="hide"
        :aria-label="t('actions.close')"
      />
    </Transition>

    <Transition name="slide-right" @after-leave="afterLeave">
      <aside
        v-if="show"
        class="absolute right-0 top-0 h-full w-5/6 sm:w-3/4 lg:w-1/2 max-w-[90vw] bg-base-200 shadow-2xl pointer-events-auto flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-label="t('drawer')"
      >
        <router-view name="drawer-content" />
      </aside>
    </Transition>
  </div>
</template>

<i18n>
{
  "en": {
    "drawer": "Drawer"
  },
  "ru": {
    "drawer": "Модальное окно"
  }
}
</i18n>
