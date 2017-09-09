/* eslint-env jest */
import 'intersection-observer';
import React from 'react';
import renderer from 'react-test-renderer';
import List from '../List';
import mockSentinel from './mockSentinel';

jest.mock('../Sentinel', () => props => {
    if (props.setRef) {
        props.setRef(jest.fn());
    }
    return mockSentinel;
});
// eslint-disable-next-line no-console
console.error = jest.fn(err => {
    throw new Error(err);
});

const target = { nodeType: 1 };
const createTree = (props = {}) => renderer.create(<List {...props} />, { createNodeMock: () => target });

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders without crashing', () => {
    createTree();
});

describe('children', () => {
    test('receives correct arguments given default props', () => {
        const spy = jest.fn();
        createTree({ itemsLength: 10, children: spy });
        expect(spy).toHaveBeenCalledTimes(10);
        expect(spy).lastCalledWith(9, 9);
    });

    test('receives correct arguments given pageSize and initialIndex props', () => {
        const spy = jest.fn();
        createTree({ initialIndex: 10, itemsLength: 30, pageSize: 15, children: spy });
        expect(spy).toHaveBeenCalledTimes(15);
        expect(spy).lastCalledWith(24, 14);
    });
});

describe('render items', () => {
    test('sentinel observes if available items in view', () => {
        const json = createTree({ itemsLength: 10, pageSize: 5 }).toJSON();
        const children = json.children;
        expect(children.length).toBe(6);
        expect(children[children.length - 1].type).toBe('sentinel');
    });

    test('sentinel gone if no items available in view', () => {
        const json = createTree({ itemsLength: 5, pageSize: 5 }).toJSON();
        const children = json.children;
        expect(children.length).toBe(5);
        expect(children[children.length - 1].type).toBe('div');
    });

    test('sentinel observes again if itemsLength is extended without re-rendering', () => {
        const tree = createTree({ itemsLength: 5, pageSize: 5 });
        const spy = jest.spyOn(tree.getInstance(), 'render');
        expect(tree.toJSON().children.length).toBe(5);
        tree.update(<List pageSize={5} itemsLength={20} />);
        expect(tree.toJSON().children.length).toBe(11);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('sentinel observes again if pageSize is extended without re-rendering', () => {
        const tree = createTree({ itemsLength: 100, pageSize: 10 });
        const spy = jest.spyOn(tree.getInstance(), 'render');
        expect(tree.toJSON().children.length).toBe(11);
        tree.update(<List itemsLength={100} pageSize={20} />);
        expect(tree.toJSON().children.length).toBe(31);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('sentinel not present if itemsLength updates from zero', () => {
        const tree = createTree({ itemsLength: 0 });
        const children = tree.toJSON().children;
        expect(children).toBeNull();
        tree.update(<List itemsLength={8} />);
        const newChildren = tree.toJSON().children;
        expect(newChildren.length).toBe(8);
        expect(newChildren[newChildren.length - 1].type).toBe('div');
    });

    test('sentinel observes with hasMore bypassing the itemsLength check', () => {
        const tree = createTree({ itemsLength: 5 });
        const children = tree.toJSON().children;
        expect(children.length).toBe(5);
        tree.update(<List itemsLength={5} hasMore />);
        const newChildren = tree.toJSON().children;
        expect(newChildren.length).toBe(6);
        expect(newChildren[newChildren.length - 1].type).toBe('sentinel');
    });
});

describe('setRootNode', () => {
    test('ref callback sets delegated the root node', () => {
        const tree = createTree({ itemsLength: 20 });
        expect(tree.getInstance().setRootNode).toBeCalledWith(target);
    });

    test('ref callback does sets root node if unmounting', () => {
        const tree = renderer.create(<List itemsLength={20} />, {
            createNodeMock: () => undefined,
        });
        expect(tree.getInstance().setRootNode).not.toBeCalled();
    });

    test('ref callback does sets root node without sentinel', () => {
        const tree = createTree({ itemsLength: 10 });
        expect(tree.getInstance().setRootNode).toBeUndefined();
    });
});

describe('handleUpdate', () => {
    test('throws once if sentinel detects intersecting on mount', () => {
        const instance = createTree().getInstance();
        expect(() => instance.handleUpdate({ isIntersecting: true })).toThrowErrorMatchingSnapshot();
        expect(() => instance.handleUpdate({ isIntersecting: true })).not.toThrow();
    });

    test('sets next size value using pageSize', () => {
        const instance = createTree({ itemsLength: 20 }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(20);
    });

    test('sets next size value using itemsLength', () => {
        const instance = createTree({ itemsLength: 15 }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(15);
    });

    test('calls onIntersection if size updates', () => {
        const spy = jest.fn();
        const instance = createTree({
            itemsLength: 30,
            onIntersection: spy,
        }).getInstance();
        instance.handleUpdate({ isIntersecting: false });
        instance.handleUpdate({ isIntersecting: true });
        instance.handleUpdate({ isIntersecting: true });
        expect(instance.state.size).toBe(30);
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
