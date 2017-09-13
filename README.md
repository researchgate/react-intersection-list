<p align="center">
  <img alt="React Intersection List" src=".github/logo.svg" width="888">
</p>

<p align="center">
  <a href="https://travis-ci.org/researchgate/react-intersection-list"><img alt="Build Status" src="https://travis-ci.org/researchgate/react-intersection-list.svg?branch=master"></a>
  <a href="https://codecov.io/gh/researchgate/react-intersection-list"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/researchgate/react-intersection-list.svg"></a>
  <a href="https://greenkeeper.io/"><img alt="Greenkeeper badge" src="https://badges.greenkeeper.io/researchgate/react-intersection-list.svg"></a>
  <a href="https://www.npmjs.com/package/@researchgate/react-intersection-list"><img alt="NPM version" src="https://img.shields.io/npm/v/@researchgate/react-intersection-list.svg"></a>
  <a href="https://github.com/prettier/prettier"><img alt="styled with prettier" src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
</p>

<br>

> **Agent Smith:** ...we have no choice but to continue as planned. Deploy the sentinels. Immediately.

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

Next create a `<List>` and two instance methods as props `children` and `itemRenderer`:

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

Note that `<List>` is a `PureComponent` so it can keep itself from re-rendering. It's highly recommended to pass referenced methods for `children` and `itemsRenderer` (in this case instance methods), so that it can successfully shallow compare props.

## Why React Intersection List?

The approach to infinite scrolling was commonly done by devs implementing throttled `scroll` event callbacks. This keeps the main thread unnecessarily busy... No more! `IntersectionObservers` invoke callbacks in a **low-priority and asynchronous** way by design.

> **Agent Smith:** Never send a human to do a machine's job.

The implementation follows these steps:

1. Add a sentinel close to the last item in the list
2. Update the list moving the internal cursor
3. Trigger a callback when the sentinel comes into view
4. Reposition the recycled sentinel at the end
5. Repeat (∞) ?

## Documentation

### How to

Provided an `itemsRenderer` prop you must attach the `ref` argument to your scrollable DOM element:

```jsx
<div ref={ref}>{items}</div>
```

This element specifies `overflow: auto|scroll` and it'll become the `IntersectionObserver root`. If the `overflow` property isn't found, then `window` will be used as the `root` instead.

The `<sentinel />` element is by default detached from the list when the current size reaches the available length, unless you're using `awaitMore`. In case your list is in memory and you rely on the list for incremental rendering only, the default detaching behavior suffices. If you're loading items asynchoronously on-demand, make sure to switch `awaitMore` once you reach the total `itemsLength`.

### FAQ

Q: Why am I receiving too many `onIntersection` callbacks

We extend `React.PureComponent`, so IF the parent component re-renders, and the _props_ passed to your `<List />` don't hold the same reference anymore, the list re-renders and may accidentally be re-attaching the `<sentinel />`.

Q: Do I always need to assign the `ref`?

Yes, this callback is used to start up the `IntersectionObserver`.

Q: What's the `threshold` value, and why does it need a _unit_?

The `threshold` value is the amount of space needed before the `<sentinel />` intersects with the root. The prop is transformed into a valid `rootMargin` property for the `IntersectionObserver`, depending on the `axis` you select. As a sidenote, we believe that a percentage unit works best for responsive layouts.

Q: I am getting a console warning when I first load the list

> The sentinel detected a viewport with a bigger size than the size of its items...

The prop `pageSize` is `10` by default, so make sure you're not falling short on items when you first render the component. The idea of an infinite scrolling list is that items overflow the viewport, so that users have the impression that there're always more items available.

### Options

- **children**: `(index: number, key: number) => React.Element<*>`

- **itemsRenderer**: `(items: Array<React.Element<*>>, ref: HTMLElement) => React.Element<*>`

- **itemsLength**: `number` | default: `0` (number of renderable items)

- **awaitMore**: `bool` | default: `false` (if true keeps the sentinel from detaching)

- **onIntersection**: `(size: number, pageSize: number) => void` (invoked when the sentinel comes into view)

- **threshold**: `string` | default: `100px` (specify in absolute `px` or `%` value)

- **axis**: `'x' | 'y'` | default: `y`

- **pageSize**: `number` | default: `10` (number of items to render per page)

- **initialIndex**: `number` | default: `0`

### Examples

Find multiple examples under: [https://researchgate.github.io/react-intersection-list/](https://researchgate.github.io/react-intersection-list/)


## Contributing

We'd love your help on creating React Intersection List!

Before you do, please read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) so you know what we expect when you contribute to our projects.

Our [Contributing Guide](.github/CONTRIBUTING.md) tells you about our development process and what we're looking for, gives you instructions on how to issue bugs and suggest features, and explains how you can build and test your changes.

**Haven't contributed to an open source project before?** No problem! [Contributing Guide](.github/CONTRIBUTING.md) has you covered as well.
