import React from 'react';
import List from '../../../../src';

const itemsRenderer = (items, ref) => (
    <div className="list list--horizontal" ref={ref}>
        {items}
    </div>
);

// eslint-disable-next-line react/no-multi-comp
const Axis = () => <List axis="x" itemCount={Infinity} itemsRenderer={itemsRenderer} pageSize={40} />;

export default Axis;
