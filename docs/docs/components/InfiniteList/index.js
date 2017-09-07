import React from 'react';
import List from '../../../../src';

export default () => (
    <List
        length={Infinity}
        pageSize={40}
        itemsRenderer={(items, ref) => (
            <div className="list" ref={ref}>
                {items}
            </div>
        )}
    >
        {(index, key) => <div key={key}>{index}</div>}
    </List>
);
