/// <reference types="vite/client" />

declare module '@kalimahapps/vue-icons/vite';

interface ImportMetaEnv {
  readonly VITE_VAPID_PUBLIC_JWK: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
