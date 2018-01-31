/* eslint-env jest */
import 'intersection-observer';
import React from 'react';
import renderer from 'react-test-renderer';
import List from '../List';
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

test('renders without crashing', () => {
    createTree();
});

describe('children', () => {
    test('receives correct arguments given default props', () => {
        const spy = jest.fn();
        createTree({ currentLength: 10, children: spy });
        expect(spy).toHaveBeenCalledTimes(10);
        expect(spy).lastCalledWith(9, 9);
    });

    test('receives correct arguments given `pageSize` and `initialIndex` props', () => {
        const spy = jest.fn();
        createTree({
            initialIndex: 10,
            currentLength: 30,
            pageSize: 15,
            children: spy,
        });
        expect(spy).toHaveBeenCalledTimes(15);
        expect(spy).lastCalledWith(24, 14);
    });
});

describe('render items', () => {
    test('sentinel observes if available items in view', () => {
        const json = createTree({ currentLength: 10, pageSize: 5 }).toJSON();
        const children = json.children;
        expect(children.length).toBe(6);
        expect(children[children.length - 1].type).toBe('span');
    });

    test('sentinel gone if no items available in view', () => {
        const json = createTree({ currentLength: 5, pageSize: 5 }).toJSON();
        const children = json.children;
        expect(children.length).toBe(5);
        expect(children[children.length - 1].type).toBe('div');
    });

    test('sentinel observes again if `currentLength` is extended without re-rendering', () => {
        const tree = createTree({ currentLength: 5, pageSize: 5 });
        const spy = jest.spyOn(tree.getInstance(), 'render');
        expect(tree.toJSON().children.length).toBe(5);
        tree.update(<List pageSize={5} currentLength={20} />);
        expect(tree.toJSON().children.length).toBe(11);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('sentinel observes again if pageSize is extended without re-rendering', () => {
        const tree = createTree({ currentLength: 100, pageSize: 10 });
        const spy = jest.spyOn(tree.getInstance(), 'render');
        expect(tree.toJSON().children.length).toBe(11);
        tree.update(<List currentLength={100} pageSize={20} />);
        expect(tree.toJSON().children.length).toBe(31);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('sentinel not present if `currentLength` updates from zero', () => {
        const tree = createTree({ currentLength: 0 });
        const children = tree.toJSON().children;
        expect(children).toBeNull();
        tree.update(<List currentLength={8} />);
        const newChildren = tree.toJSON().children;
        expect(newChildren.length).toBe(8);
        expect(newChildren[newChildren.length - 1].type).toBe('div');
    });

    test('sentinel observes with `awaitMore` bypassing the `currentLength` check', () => {
        const tree = createTree({ currentLength: 5 });
        const children = tree.toJSON().children;
        expect(children.length).toBe(5);
        tree.update(<List currentLength={5} awaitMore={true} />);
        const newChildren = tree.toJSON().children;
        expect(newChildren.length).toBe(6);
        expect(newChildren[newChildren.length - 1].type).toBe('span');
    });
});

describe('setRootNode', () => {
    test('ref callback sets root node', () => {
        createTree({ currentLength: 20 });
        expect(mockCallback).toBeCalledWith(target);
    });

    test('ref callback does sets root node if unmounting', () => {
        renderer.create(<List currentLength={20} />, {
            createNodeMock: () => undefined,
        });
        expect(mockCallback).not.toBeCalled();
    });

    test('ref callback does sets root node without sentinel', () => {
        const tree = createTree({ currentLength: 10 });
        expect(tree.getInstance().setRootNode).toBeUndefined();
    });

    test('ref callback sets a null root if it does not have overflow', () => {
        window.getComputedStyle = jest.fn(() => ({
            overflowY: 'visible',
        }));
        createTree({ currentLength: 20 });
        expect(mockCallback).toBeCalledWith(null);
    });

    test('having same root node prevents call getComputedStyle', () => {
        const tree = createTree({ currentLength: 20 });
        tree.getInstance().setRootNode(target);
        expect(window.getComputedStyle).toHaveBeenCalledTimes(1);
    });
});

describe('handleUpdate', () => {
    test('throws once if sentinel intersects with items on mount', () => {
        const spy = global.spyOn(console, 'error');
        const instance = createTree({ currentLength: 10 }).getInstance();
        instance.handleUpdate({ isIntersecting: true });
        expect(spy.calls.mostRecent().args[0]).toMatchSnapshot();
        instance.handleUpdate({ isIntersecting: true });
        expect(spy.calls.count()).toBe(1);
        createTree({ currentLength: 0 })
            .getInstance()
            .handleUpdate({ isIntersecting: true });
        expect(spy.calls.count()).toBe(1);
    });

    test('sets next size value computed into `pageSize`', () => {
        const instance = createTree({ currentLength: 20 }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(20);
    });

    test('sets next size value computed into `currentLength`', () => {
        const instance = createTree({ currentLength: 15 }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(15);
    });

    test('calls `onIntersection` each time when `awaitIntersection` is falsy', () => {
        const spy = jest.fn();
        const instance = createTree({
            currentLength: 30,
            onIntersection: spy,
        }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(30);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    test('calls `onIntersection` only once when `awaitIntersection` is true', () => {
        const spy = jest.fn();
        const tree = createTree({
            awaitMore: true,
            currentLength: 10,
            onIntersection: spy,
        });
        tree.getInstance().handleUpdate({ isIntersecting: false });
        tree.getInstance().handleUpdate({ isIntersecting: true });
        tree.getInstance().handleUpdate({ isIntersecting: true });
        expect(tree.getInstance().state.size).toBe(10);
        tree.update(<List awaitMore={true} currentLength={30} onIntersection={spy} />);
        tree.getInstance().handleUpdate({ isIntersecting: true });
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
