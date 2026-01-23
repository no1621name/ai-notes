import type { Component, ComputedOptions, MethodOptions } from 'vue';
import type { Editor } from '@tiptap/core';
import { VueRenderer, posToDOMRect } from '@tiptap/vue-3';
import { computePosition, flip, shift, type FloatingElement, type VirtualElement } from '@floating-ui/dom';

import { i18n } from '@/app/providers/i18n';
import type { CommandItem, CommandsOptions, RendererComponentProps } from './types';

interface RenderComponentMethods extends MethodOptions {
  onKeyDownHandler: ({ event }: { event: KeyboardEvent }) => boolean;
};

interface GetCommandsOptionsParameters {
  RenderComponent: Component<RendererComponentProps, unknown, unknown, ComputedOptions, RenderComponentMethods>;
  items: CommandItem[];
  mountElement: HTMLElement;
}

const isHtmlElement = (component: VueRenderer): component is VueRenderer & { element: HTMLElement } => {
  return component.element instanceof HTMLElement;
};

const updatePosition = (editor: Editor, element: FloatingElement) => {
  const virtualElement: VirtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  };

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [flip(), shift()],
  }).then(({ x, y, strategy }) => {
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.zIndex = '50';
  });
};

export const getCommandsOptions = ({ RenderComponent, items, mountElement }: GetCommandsOptionsParameters): CommandsOptions => {
  let component: VueRenderer;

  return {
    items: ({ query }) => items.filter(item => i18n.global.t(item.label).toLowerCase().includes(query.toLowerCase())),
    render: () => ({
      onStart: (props) => {
        component = new VueRenderer(RenderComponent, {
          props,
          editor: props.editor,
        });

        if (!isHtmlElement(component)) {
          return;
        }

        mountElement.appendChild(component.element);

        updatePosition(props.editor, component.element);
      },
      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect || !isHtmlElement(component)) {
          return;
        }

        updatePosition(props.editor, component.element);
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component.destroy();

          if (isHtmlElement(component)) {
            component.element.remove();
          }

          return true;
        }

        return (component.ref as RenderComponentMethods).onKeyDownHandler(props);
      },
      onExit() {
        component.destroy();

        if (isHtmlElement(component)) {
          component.element.remove();
        }
      },
    }),
  };
};
