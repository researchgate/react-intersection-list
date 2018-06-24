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

**React Intersection List** builds on top of
**[React Intersection Observer](https://github.com/researchgate/react-intersection-observer)**, using a
[sentinel](https://en.wikipedia.org/wiki/Sentinel_value) in the DOM to deliver a high-performance and smooth scrolling
experience, even on low-end devices.

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
import React, { Component } from 'react';
import List from '@researchgate/react-intersection-list';

export default class InfiniteList extends Component {
    itemsRenderer = (items, ref) => (
        <ul className="list" ref={ref}>
            {items}
        </ul>
    );

    itemRenderer = (index, key) => <li key={key}>{index}</li>;

    render() {
        return <List itemCount={1000} itemsRenderer={this.itemsRenderer} renderItem={this.itemRenderer} />;
    }
}
```

Note that `<List>` is a `PureComponent` so it can keep itself from re-rendering. It's highly recommended to avoid
creating new functions for `renderItem` and `itemsRenderer` so that it can successfully shallow compare props on
re-render.

## Why React Intersection List?

The approach to infinite scrolling was commonly done by devs implementing throttled `scroll` event callbacks. This keeps
the main thread unnecessarily busy... No more! `IntersectionObservers` invoke callbacks in a **low-priority and
asynchronous** way by design.

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
<div ref={ref}>{items}</div>;
```

This element specifies `overflow: auto|scroll` and it'll become the `IntersectionObserver root`. If the `overflow`
property isn't found, then `window` will be used as the `root` instead.

The `sentinel` element is by default detached from the list when the current size reaches the available length, unless
you're using `awaitMore`. In case your list is in memory and you rely on the list for incremental rendering only, the
default detaching behavior suffices. If you're loading more items in an asynchoronous way, make sure you switch
`awaitMore` once you reach the total length (bottom of the list).

The prop `itemCount` must be used if the prop `items` is not provided, and viceversa. Calculating the list size is done
by adding the current size and the page size until the items' length is reached.

### FAQ

<details>
  <summary>Why am I receiving too many `onIntersection` callbacks</summary>
  We extend `PureComponent`. That means, if the parent component re-renders and the _props_ passed to your `<List />` don't
hold the same reference anymore, the list re-renders and we accidentally restart the `IntersectionObserver` of the `Sentinel`.
</details>
<br />
<details>
  <summary>Do I always need to assign the `ref`?</summary>
  Yes, the ref callback will be used as the `root` and is forwarded to the `IntersectionObserver` within the `Sentinel`.
</details>
<br />
<details>
  <summary>What's the `threshold` value, and why does it need a *unit*?</summary>
  The `threshold` value is the amount of space needed before the `sentinel` intersects with the root. The prop is
transformed into a valid `rootMargin` property for the `IntersectionObserver`, depending on the `axis` you select. As a
sidenote, we believe that a percentage unit works best for responsive layouts.
</details>
<br />
<details>
  <summary>I am getting a console warning when I first load the list</summary>
  <blockquote>The sentinel detected a viewport with a bigger size than the size of its items...</blockquote>
The prop `pageSize` is `10` by default, so make sure you're not falling short on items when you first render the
component. The idea of an infinite scrolling list is that items overflow the viewport, so that users have the impression that there're always more items available.
</details>
<br />
<details>
  <summary>Why doesn't the list render my updated list element(s)?</summary>
  The list renders items based on its props. An update somewhere else in your app (or within your list item) might update
your list element(s), but if your list's `currentLength` prop for instance, remains unchanged, the list prevents a
re-render. Updating the entire infinite list when one of its items has changed is far from optimal. Instead, update each item individually with some form of `connect()` function or observables.
</details>
<br />
<details>
  <summary>Are you planning to implement a "virtual list mode" like react-virtualized?</summary>
  Yes, there's already an [open issue](https://github.com/researchgate/react-intersection-list/issues/2) to implement a
mode using occlusion culling. It will be implemented in a future release. If you can't wait, you could help us out by opening a Pull Request :)
</details>

### Props

| property              | type                                                               | default                                        | description                                                                                             |
| --------------------- | ------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `renderItem/children` | `(index: number, key: number) => React.Element`                    | `(index, key) => <div key={key}>{index}</div>` | render function as children or render props;<br />gets call once for each item.                         |
| `itemsRenderer`       | `(items: Array(React.Element), ref: HTMLElement) => React.Element` | `(items, ref) => <div ref={ref}>{items}</div>` | render function for the list's<br />root element, often returning a scrollable element.                 |
| `itemCount/items`     | `number/Array (or Iterable Object)`                                | `0`                                            | item count to render.                                                                                   |
| `awaitMore`           | `boolean`                                                          |                                                | if true keeps the sentinel from detaching.                                                              |
| `onIntersection`      | `(size: number, pageSize: number) => void`                         |                                                | invoked when the sentinel comes into view.                                                              |
| `threshold`           | `string`                                                           | `100px`                                        | value in absolute `px` or `%`<br />as spacing before the sentinel hits the edge of the list's viewport. |
| `axis`                | `string`                                                           | `y`                                            | scroll direction: `y` == vertical and `x` == horizontal                                                 |
| `pageSize`            | `number`                                                           | `10`                                           | number of items to render each hit.                                                                     |
| `initialIndex`        | `number`                                                           | `0`                                            | start position of iterator of items.                                                                    |

### Examples

Find multiple examples under:
[https://researchgate.github.io/react-intersection-list/](https://researchgate.github.io/react-intersection-list/)

## Contributing

We'd love your help on creating React Intersection List!

Before you do, please read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) so you know what we expect when you
contribute to our projects.

Our [Contributing Guide](.github/CONTRIBUTING.md) tells you about our development process and what we're looking for,
gives you instructions on how to issue bugs and suggest features, and explains how you can build and test your changes.

**Haven't contributed to an open source project before?** No problem! [Contributing Guide](.github/CONTRIBUTING.md) has
you covered as well.
