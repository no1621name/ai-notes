import type { InjectionKey } from 'vue';

export const DRAWER_HIDE_INJECTION_KEY = Symbol('drawer-hide') as InjectionKey<() => void>;
