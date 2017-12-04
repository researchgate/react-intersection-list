import React from 'react';
import List from '../../../../src';

const itemsRenderer = (items, ref) => (
    <div className="list" ref={ref}>
        {items}
    </div>
);

// eslint-disable-next-line react/no-multi-comp
const InfiniteList = () => <List itemCount={Infinity} itemsRenderer={itemsRenderer} pageSize={40} />;

export default InfiniteList;
