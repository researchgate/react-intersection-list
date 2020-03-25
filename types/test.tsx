import * as React from 'react';
import List from '..';

<List items={[]}>{() => ''}</List>;

<List itemCount={Infinity} renderItem={() => <b>bold</b>} />;

<List
  itemCount={100}
  awaitMore={false}
  axis="y"
  initialIndex={50}
  pageSize={25}
  threshold="50%"
  itemsRenderer={(items, ref) => <div ref={ref}>{items}</div>}
  onIntersection={() => {}}
>
  {(index, key) => `${index}${key}`}
</List>;
