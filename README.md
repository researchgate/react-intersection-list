# [React Intersection List](https://researchgate.github.io/react-intersection-list/)

[![Greenkeeper badge](https://badges.greenkeeper.io/researchgate/react-intersection-list.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/researchgate/react-intersection-list.svg?branch=master)](https://travis-ci.org/researchgate/react-intersection-list) [![Codecov](https://img.shields.io/codecov/c/github/researchgate/react-intersection-list.svg)](https://codecov.io/gh/researchgate/react-intersection-list) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Agent Smith: ...we have no choice but to continue as planned. Deploy the sentinels. Immediately.

<br>

ReactIntersectionList is a **React** component, using a recycled sentinel element and relying on the very performant **IntersectionObserver API**.


```jsx
import React from 'react';
import List from '@researchgate/react-intersection-list';

export default class MyList extends React.Component {
    itemsRenderer = (items, ref) => (
        <div className="list" ref={ref}>
            {items}
        </div>
    );

    itemRenderer = (index, key) => (
        <div key={key}>{index}</div>
    );

    return() {
        return => (
            <List length={1000} itemsRenderer={this.itemsRenderer}>
                {this.itemRenderer}
            </List>
        );
    }
}
```