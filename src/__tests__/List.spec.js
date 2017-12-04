/* eslint-env jest */
import 'intersection-observer';
import React from 'react';
import renderer from 'react-test-renderer';
import List from '../';
import mockSentinel, { mockCallback } from './mockSentinel';

jest.mock('../Sentinel', () => props => {
    if (props.setRef) {
        props.setRef(mockCallback);
    }
    return mockSentinel;
});

const target = { nodeType: 1 };
const createTree = (props = {}) => renderer.create(<List {...props} />, { createNodeMock: () => target });

beforeEach(() => {
    jest.clearAllMocks();

    window.getComputedStyle = jest.fn(() => ({
        overflowX: 'auto',
        overflowY: 'auto',
    }));
});

test('render component with default props', () => {
    createTree();
});

describe('render children given pertinent props', () => {
    test('receives correct arguments given default props', () => {
        const spy = jest.fn();
        createTree({ itemCount: 10, children: spy });
        expect(spy).toHaveBeenCalledTimes(10);
        expect(spy).lastCalledWith(9, 9);
    });

    test('receives correct arguments given `pageSize` and `initialIndex` props', () => {
        const spy = jest.fn();
        createTree({
            initialIndex: 10,
            itemCount: 30,
            pageSize: 15,
            children: spy,
        });
        expect(spy).toHaveBeenCalledTimes(15);
        expect(spy).lastCalledWith(24, 14);
    });
});

describe('render component given pertinent props', () => {
    test('pure component avoids unnecessary re-rendering', () => {
        const props = { pageSize: 5, itemCount: 25 };
        const tree = createTree(props);
        const spy = jest.spyOn(tree.getInstance(), 'render');
        tree.update(<List {...props} />);
        expect(spy).not.toHaveBeenCalled();
    });

    test('throw with two different render function props', () => {
        const spy = global.spyOn(console, 'error');
        createTree({ children() {}, renderItem() {}, itemCount: 2 });
        expect(spy.calls.mostRecent().args[0]).toMatchSnapshot();
    });

    test('render children function', () => {
        const props = { children() {}, itemCount: 2 };
        const spy = jest.spyOn(props, 'children');
        createTree(props);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    test('render prop function', () => {
        const props = { renderItem() {}, itemCount: 2 };
        const spy = jest.spyOn(props, 'renderItem');
        createTree(props);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    test('throw with both itemCount and items props set', () => {
        const spy = global.spyOn(console, 'error');
        createTree({ items: 666 });
        expect(spy.calls.mostRecent().args[0]).toMatchSnapshot();
    });

    test('render with items instead of itemCount', () => {
        const json = createTree({ items: [1, 2] }).toJSON();
        const children = json.children;
        expect(children.length).toBe(2);
    });

    test('render empty items if no prop is given to determine length', () => {
        const instance = createTree().getInstance();
        expect(instance.getItemCount({})).toBe(0);
    });

    test('render with iterable Set', () => {
        const items = new Set([1, 2, 3]);
        const json = createTree({ items }).toJSON();
        const children = json.children;
        expect(children.length).toBe(3);
    });
});

describe('render items given sentinel', () => {
    test('sentinel observes if available items in view', () => {
        const json = createTree({ itemCount: 10, pageSize: 5 }).toJSON();
        const children = json.children;
        expect(children.length).toBe(6);
        expect(children[children.length - 1].type).toBe('span');
    });

    test('sentinel gone if no items available in view', () => {
        const json = createTree({ itemCount: 5, pageSize: 5 }).toJSON();
        const children = json.children;
        expect(children.length).toBe(5);
        expect(children[children.length - 1].type).toBe('div');
    });

    test('sentinel observes again if `itemCount` increases', () => {
        const tree = createTree({ itemCount: 5, pageSize: 5 });
        expect(tree.toJSON().children.length).toBe(5);
        tree.update(<List pageSize={5} itemCount={20} />);
        expect(tree.toJSON().children.length).toBe(11);
    });

    test('sentinel observes again if `pageSize` increases', () => {
        const tree = createTree({ itemCount: 100, pageSize: 10 });
        expect(tree.toJSON().children.length).toBe(11);
        tree.update(<List itemCount={100} pageSize={20} />);
        expect(tree.toJSON().children.length).toBe(31);
    });

    test('sentinel not present if `itemCount` increases below `pageSize`', () => {
        const tree = createTree({ itemCount: 0 });
        const children = tree.toJSON().children;
        expect(children).toBeNull();
        tree.update(<List itemCount={8} />);
        const newChildren = tree.toJSON().children;
        expect(newChildren.length).toBe(8);
        expect(newChildren[newChildren.length - 1].type).toBe('div');
    });

    test('sentinel observes with `awaitMore` bypassing the `itemCount` check', () => {
        const tree = createTree({ itemCount: 5 });
        const children = tree.toJSON().children;
        expect(children.length).toBe(5);
        tree.update(<List itemCount={5} awaitMore={true} />);
        const newChildren = tree.toJSON().children;
        expect(newChildren.length).toBe(6);
        expect(newChildren[newChildren.length - 1].type).toBe('span');
    });
});

describe('set root node', () => {
    test('ref callback sets root node', () => {
        createTree({ itemCount: 20 });
        expect(mockCallback).toBeCalledWith(target);
    });

    test('ref callback does sets root node if unmounting', () => {
        renderer.create(<List itemCount={20} />, {
            createNodeMock: () => undefined,
        });
        expect(mockCallback).not.toBeCalled();
    });

    test('ref callback does sets root node without sentinel', () => {
        const tree = createTree({ itemCount: 10 });
        expect(tree.getInstance().setRootNode).toBeUndefined();
    });

    test('ref callback sets a null root if it does not have overflow', () => {
        window.getComputedStyle = jest.fn(() => ({
            overflowY: 'visible',
        }));
        createTree({ itemCount: 20 });
        expect(mockCallback).toBeCalledWith(null);
    });

    test('having same root node prevents call getComputedStyle', () => {
        const tree = createTree({ itemCount: 20 });
        tree.getInstance().setRootNode(target);
        expect(window.getComputedStyle).toHaveBeenCalledTimes(1);
    });
});

describe('handle updates', () => {
    test('throws once if sentinel intersects with items on mount', () => {
        const spy = global.spyOn(console, 'error');
        const instance = createTree({ itemCount: 10 }).getInstance();
        instance.handleUpdate({ isIntersecting: true });
        expect(spy.calls.mostRecent().args[0]).toMatchSnapshot();
        instance.handleUpdate({ isIntersecting: true });
        expect(spy.calls.count()).toBe(1);
        createTree({ itemCount: 0 })
            .getInstance()
            .handleUpdate({ isIntersecting: true });
        expect(spy.calls.count()).toBe(1);
    });

    test('sets next size value computed into `pageSize`', () => {
        const instance = createTree({ itemCount: 20 }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(20);
    });

    test('sets next size value computed into `itemCount`', () => {
        const instance = createTree({ itemCount: 15 }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(15);
    });

    test('invokes `onIntersection` each time when `awaitIntersection` is false', () => {
        const spy = jest.fn();
        const instance = createTree({
            itemCount: 30,
            onIntersection: spy,
        }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(30);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    test('invokes `onIntersection` only once when `awaitIntersection` is true', () => {
        const spy = jest.fn();
        const props = {
            awaitMore: true,
            itemCount: 10,
            onIntersection: spy,
        };
        const tree = createTree(props);
        tree.getInstance().handleUpdate({ isIntersecting: false });
        tree.getInstance().handleUpdate({ isIntersecting: true });
        tree.getInstance().handleUpdate({ isIntersecting: true });
        expect(tree.getInstance().state.size).toBe(10);
        tree.update(<List {...props} itemCount={20} />);
        tree.getInstance().handleUpdate({ isIntersecting: true });
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
