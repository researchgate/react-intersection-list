import 'intersection-observer'; // eslint-disable-line import/no-extraneous-dependencies
import 'whatwg-fetch'; // eslint-disable-line import/no-extraneous-dependencies
import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import InfiniteList from './components/InfiniteList';
import AsyncList from './components/AsyncList';
import Axis from './components/Axis';
import './components/style.css';

storiesOf('Examples', module)
    .add('Synchoronous', InfiniteList)
    .add('Asynchoronous', () => <AsyncList />)
    .add('X-Axis', Axis);
