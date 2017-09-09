# [React Intersection List](https://researchgate.github.io/react-intersection-list/)

[![Build Status](https://travis-ci.org/researchgate/react-intersection-list.svg?branch=master)](https://travis-ci.org/researchgate/react-intersection-list) [![Codecov](https://img.shields.io/codecov/c/github/researchgate/react-intersection-list.svg)](https://codecov.io/gh/researchgate/react-intersection-list) [![Greenkeeper badge](https://badges.greenkeeper.io/researchgate/react-intersection-list.svg)](https://greenkeeper.io/) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> **Agent Smith:** ...we have no choice but to continue as planned. Deploy the sentinels. Immediately.

<br>

<!-- ### An Infinite Scroller List Component -->

**React Intersection List** builds on top of **[React Intersection Observer](https://github.com/researchgate/react-intersection-observer)**, using a [sentinel](https://en.wikipedia.org/wiki/Sentinel_value) in the DOM to deliver a high-performance and smooth scrolling experience, even on low-end devices.

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
            <List itemsLength={1000} itemsRenderer={this.itemsRenderer}>
                {this.itemRenderer}
            </List>
        );
    }
}
```

Note that as `<List>` is a `PureComponent`, so it can keep itself from re-rendering. It's highly recommended to pass referenced methods for `children` and `itemsRenderer` (in this case instance methods), so that it can successfully shallow compare props.

## Why React Intersection List?

The approach to infinite scrolling was commonly done by devs implementing throttled `scroll` event callbacks. This keeps the main thread unnecessarily busy... No more! `IntersectionObservers`' invoke callbacks in a **low-priority and asynchronous** way by design.

> **Agent Smith:** Never send a human to do a machine's job.

The implementation follows these steps:

1. Add a sentinel close to the last item in the list
2. Update the list moving the internal cursor
3. Trigger a callback when the sentinel comes into view
4. Reposition the recycled sentinel at the end
5. Repeat (∞) ?

## Documentation

### Options

- **children**: `(index: number, key: number) => React.Element<*>`

- **itemsRenderer**: `(items: Array<React.Element<*>>, ref: Element) => React.Element<*>`

- **itemsLength**: `number` | default: `0` (number of items to render)

- **hasMore**: `bool` | default: `false` (if true forces the sentinel to observe)

- **threshold**: `string` | default: `100px` (specify using units _px_ or _%_ without negative values)

- **axis**: `'x' | 'y'` | Default: `y`

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
