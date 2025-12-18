import { inject, provide, type InjectionKey } from 'vue';

type HideFunction = () => void;
const DRAWER_HIDE_INJECTION_KEY = Symbol('drawer-hide') as InjectionKey<HideFunction>;

export const useDrawerHide = () => {
  const getHide = () => inject(DRAWER_HIDE_INJECTION_KEY);

  const setHide = (hide: HideFunction) => provide(DRAWER_HIDE_INJECTION_KEY, hide);

  return {
    getHide,
    setHide,
  };
};
