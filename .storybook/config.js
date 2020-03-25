import { addParameters, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

withOptions({
    name: 'React Intersection List',
    url: 'https://github.com/researchgate/react-intersection-list',
    showDownPanel: false,
});

addParameters({ options: { theme: {} } });

configure(() => require('../docs/docs/index.js'), module);
