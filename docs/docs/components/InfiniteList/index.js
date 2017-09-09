import React from 'react';
import List from '../../../../src';

export default () => (
    <List
        itemsLength={Infinity}
        itemsRenderer={(items, ref) => (
            <div className="list" ref={ref}>
                {items}
            </div>
        )}
        pageSize={40}
    >
        {(index, key) => <div key={key}>{index}</div>}
    </List>
);
