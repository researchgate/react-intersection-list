import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'React Intersection List',
  url: 'https://github.com/researchgate/react-intersection-list',
  showDownPanel: false,
});

storybook.configure(() => require('../docs/docs/index.js'), module);
