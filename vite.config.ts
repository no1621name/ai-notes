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
});
