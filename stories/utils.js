import { storiesOf } from '@storybook/react';

const noop = () => null;

export function addNewStories(kind, stories) {
  let currentModule = storiesOf(kind, module);
  stories.forEach((item) => {
    currentModule = currentModule.add(item.name, item.component ? item.component : noop, {
      info: {
        text: item.doc,
        disable: !!item.disable,
        inline: !!item.inline,
        source: item.source !== undefined ? item.source : false
      }
    });
  });
}

/**
 * 根据屏幕宽度判断设备
 * @returns {boolean}
 */
export function isMobile() {
  return document.body.offsetWidth <= 767;
}
