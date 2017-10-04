import React from 'react';
import List from '../../../../src';

const itemsRenderer = (items, ref) => (
    <div className="list list--horizontal" ref={ref}>
        {items}
    </div>
);

// eslint-disable-next-line react/no-multi-comp
export default () => <List axis="x" currentLength={Infinity} itemsRenderer={itemsRenderer} pageSize={40} />;
