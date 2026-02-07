<script setup lang="ts">
import { onActivated, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDrawerHide } from '@/shared/composables/use-drawer-hide';
import { useIsMobile } from '@/shared/composables/use-media-query';

const { setHide } = useDrawerHide();

const { locale, t } = useI18n();
const router = useRouter();
const show = ref(false);
let closing = false;

const isMobile = useIsMobile();

const transitionName = computed(() => isMobile.value ? 'slide-up' : 'slide-right');

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

    <Transition :name="transitionName" @after-leave="afterLeave">
      <aside
        v-if="show"
        class="bg-base-200 shadow-2xl pointer-events-auto flex flex-col fixed sm:absolute bottom-0 sm:top-0 sm:right-0 w-full sm:w-3/4 lg:w-1/2 sm:h-full h-[85vh] sm:rounded-none rounded-t-2xl z-20 sm:z-auto sm:max-w-[90vw]"
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
