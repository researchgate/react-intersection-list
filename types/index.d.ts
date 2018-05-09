import * as React from 'react';

export default class ListClass extends React.PureComponent<ListProps> {}

type RenderFunction = (index: number, key: number) => JSX.Element | string;

type IterableType =
    | {
          length: number;
      }
    | {
          size: number;
      };

interface ChildrenAsFunction {
    children: RenderFunction;
    renderItem?: never;
}

interface RenderAsProp {
    renderItem: RenderFunction;
    children?: never;
}

interface ItemCountScalar {
    itemCount: number;
    items?: never;
}

interface ItemCountIterable {
    items: IterableType;
    itemCount?: never;
}

interface OptionalProps {
    awaitMore?: boolean;
    axis?: 'x' | 'y';
    initialIndex?: number;
    itemsRenderer?: (items: IterableType, ref: (instance: React.ReactInstance) => void) => JSX.Element;
    onIntersection?: (nextSize: number, pageSize: number) => undefined;
    pageSize?: number;
    threshold?: string;
}

type RenderPropType = ChildrenAsFunction | RenderAsProp;

type ItemCountPropType = ItemCountScalar | ItemCountIterable;

type ListProps = RenderPropType & ItemCountPropType & OptionalProps;
