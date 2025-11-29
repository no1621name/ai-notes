import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwind from '@tailwindcss/vite';
import vueIconsPlugin from '@kalimahapps/vue-icons/vite';
import { analyzer, unstableRolldownAdapter } from 'vite-bundle-analyzer';

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
  plugins: [vue(), vueDevTools(), tailwind(), iconsPlugin, unstableRolldownAdapter(analyzer())],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
