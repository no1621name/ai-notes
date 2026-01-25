import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwind from '@tailwindcss/vite';
import vueIconsPlugin from '@kalimahapps/vue-icons/vite';
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { dirname, resolve } from 'node:path';

const iconsPlugin = vueIconsPlugin();
const originalTransform = iconsPlugin.transform;
if (typeof originalTransform === 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconsPlugin.transform = function (code: string, id: string, options: any) {
    if (id.includes('node_modules')) {
      return;
    }
    return originalTransform.call(this, code, id, options);
  };
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwind(),
    iconsPlugin,
    vueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), 'src/**/locales/**'),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('@intlify') || id.includes('vue-i18n')) {
              return 'vue-vendor';
            }
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'tiptap-vendor';
            }
            if (id.includes('@floating-ui') || id.includes('daisyui') || id.includes('@kalimahapps')) {
              return 'ui-vendor';
            }
            if (
              id.includes('@tanstack')
              || id.includes('@regle')
              || id.includes('arktype')
              || id.includes('uuid')
              || id.includes('dayjs')
              || id.includes('supabase')
              || id.includes('groq-sdk')
            ) {
              return 'utils-vendor';
            }
          }
        },
      },
    },
  },
});
