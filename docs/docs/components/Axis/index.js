import React from 'react';
import List from '../../../../src';

export default () => (
    <List
        axis="x"
        itemsLength={Infinity}
        itemsRenderer={(items, ref) => (
            <div className="list list--horizontal" ref={ref}>
                {items}
            </div>
        )}
        pageSize={40}
    >
        {(index, key) => <div key={key}>{index}</div>}
    </List>
);
