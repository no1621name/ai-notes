import type { Directive } from 'vue';

type ClickOutsideDirectiveHandler = (event: MouseEvent) => void;

type ClickOutsideDirective = Directive<HTMLElement & { clickOutsideEvent: ClickOutsideDirectiveHandler }, ClickOutsideDirectiveHandler>;

declare module 'vue' {
  export interface GlobalDirectives {
    vClickOutside: ClickOutsideDirectiveHandler;
  }
}

export const clickOutsideDirective: ClickOutsideDirective = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
