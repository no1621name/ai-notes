import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwind from '@tailwindcss/vite';
import vueIconsPlugin from '@kalimahapps/vue-icons/vite';

export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwind(), vueIconsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
