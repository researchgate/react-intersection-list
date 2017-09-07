# [React Intersection List](https://researchgate.github.io/react-intersection-list/)

[![Greenkeeper badge](https://badges.greenkeeper.io/researchgate/react-intersection-list.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/researchgate/react-intersection-list.svg?branch=master)](https://travis-ci.org/researchgate/react-intersection-list) [![Codecov](https://img.shields.io/codecov/c/github/researchgate/react-intersection-list.svg)](https://codecov.io/gh/researchgate/react-intersection-list) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> **Agent Smith:** ...we have no choice but to continue as planned. Deploy the sentinels. Immediately.

<br>

<!-- ### An Infinite Scroller List Component -->

**React Intersection List** builds on top of **[React Intersection Observer](https://github.com/researchgate/react-intersection-observer)**, using `IntersectionObservers` to deliver a high-performance and smooth scrolling experience, even on low-end devices.

## Getting Started

```
$ npm install --save @researchgate/react-intersection-list
```

And optionally the [polyfill](https://github.com/w3c/IntersectionObserver/tree/gh-pages/polyfill):

```
$ npm install --save intersection-observer
```

Next create a `<List>` with two instance methods for `children` and `itemRenderer`:

```jsx
import React from 'react';
import List from '@researchgate/react-intersection-list';

export default class MyList extends React.Component {
    itemsRenderer = (items, ref) => (
        <ul className="list" ref={ref}>
            {items}
        </ul>
    );

    itemRenderer = (index, key) => (
        <li key={key}>{index}</li>
    );

    render() {
        return (
            <List length={1000} itemsRenderer={this.itemsRenderer}>
                {this.itemRenderer}
            </List>
        );
    }
}
```

Note that `<List>` is always a `PureComponent`, so we're using instance methods to avoid providing new `children` and/or `itemsRenderer` when `MyList` re-renders.

## Why React Intersection List?

Traditional solutions to this problem rely on throttled `scroll` event callbacks. This blocks the main thread... No more! The callbacks from `IntersectionObservers` are **low-priority and asynchronous** by design.

> **Agent Smith:** Never send a human to do a machine's job:

1. Add a sentinel close to the last item in the list
2. Trigger a callback when the sentinel comes into view
3. Update the list and reposition the recycled sentinel
4. Repeat (∞) ?

## Documentation

### Options

- **children**: `(index: number, key: number) => React.Element<*>`

- **itemsRenderer**: `(items: Array<React.Element<*>>, ref: Element) => React.Element<*>`

- **length**: `number` | default: `0` (size of the list - the number of total items)

- **threshold**: `string` | default: `100px` (specify using units _px_ or _%_ without negative values)

- **axis**: `'x' | 'y'` | Default: `0`

- **pageSize**: `number` | Default: `10`

- **initialIndex**: `number` | Default: `0`

- **onIntersection**: `(size: number, pageSize: number) => void` (invoked when the sentinel comes into view)

### Examples

Find multiple examples under: [https://researchgate.github.io/react-intersection-list/](https://researchgate.github.io/react-intersection-list/)


## Contributing

We'd love your help on creating React Intersection List!

Before you do, please read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) so you know what we expect when you contribute to our projects.

Our [Contributing Guide](.github/CONTRIBUTING.md) tells you about our development process and what we're looking for, gives you instructions on how to issue bugs and suggest features, and explains how you can build and test your changes.

**Haven't contributed to an open source project before?** No problem! [Contributing Guide](.github/CONTRIBUTING.md) has you covered as well.