import React from 'react';
import List from '../../../../src';

export default () => (
    <List
        axis="x"
        length={Infinity}
        pageSize={40}
        itemsRenderer={(items, ref) => (
            <div className="list list--horizontal" ref={ref}>
                {items}
            </div>
        )}
    >
        {(index, key) => <div key={key}>{index}</div>}
    </List>
);
