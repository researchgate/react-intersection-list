/* eslint-env jest */
import 'intersection-observer';
import React from 'react';
import renderer from 'react-test-renderer';
import Sentinel from '../Sentinel';

jest.mock('@researchgate/react-intersection-observer', () => {
    return jest.fn(() => null);
});

const defaultProps = {
    axis: 'y',
    threshold: '100px',
    setRef: jest.fn(),
    onChange() {},
};
const createTree = (props = defaultProps) => renderer.create(<Sentinel {...props} />);

describe('constructor', () => {
    const propTypes = Sentinel.propTypes;

    beforeAll(() => {
        Sentinel.propTypes = {};
    });

    afterAll(() => {
        Sentinel.propTypes = propTypes;
    });

    test('calls computeRootMargin and setRef', () => {
        const impl = () => {};
        const renderSpy = jest.spyOn(Sentinel.prototype, 'render').mockImplementation(impl);
        const spy = jest.spyOn(Sentinel.prototype, 'computeRootMargin').mockImplementation(impl);
        const mock = jest.fn();
        const props = { setRef: mock };
        const component = <Sentinel {...props} />;
        const tree = renderer.create(component);
        expect(spy).toBeCalledWith(props);
        expect(mock).toBeCalledWith(tree.getInstance().setRootElement);
        spy.mockRestore();
        renderSpy.mockRestore();
    });
});

describe('render', () => {
    test('first time sets a disabled observer', () => {
        const spy = require('@researchgate/react-intersection-observer');
        createTree();
        expect(spy.mock.calls[spy.mock.calls.length - 1][0]).toHaveProperty('disabled', true);
        expect(spy.mock.calls[spy.mock.calls.length - 1][0]).toHaveProperty('root', undefined);
    });

    test('re-renders when setRef callback is called', () => {
        const instance = createTree().getInstance();
        const renderSpy = jest.spyOn(instance, 'render');
        const setRefMock = instance.props.setRef.mock;
        const setRefCallback = setRefMock.calls[setRefMock.calls.length - 1][0];
        setRefCallback(null);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('avoids re-render if new props are the same', () => {
        const tree = createTree();
        const renderSpy = jest.spyOn(tree.getInstance(), 'render');
        const spy = jest.fn();
        tree.getInstance().observer = {
            reobserve: spy,
        };
        tree.update(<Sentinel {...defaultProps} />);
        expect(renderSpy).not.toBeCalled();
        expect(spy).toBeCalled();
    });
});

describe('compute', () => {
    test('returns computed rootMargin', () => {
        const instance = createTree().getInstance();
        expect(instance.computeRootMargin({ threshold: '50%', axis: 'x' })).toBe('0% 50%');
        expect(instance.computeRootMargin({ threshold: '50px', axis: 'y' })).toBe('50px 0px');
        expect(instance.computeRootMargin({ threshold: '50', axis: 'y' })).toBe('50 0');
    });

    test('new axis or threshold props set new rootMargin', () => {
        const instance = createTree().getInstance();
        instance.componentWillReceiveProps({ ...defaultProps, axis: 'x' });
        expect(instance.state.rootMargin).toBe('0px 100px');
        instance.componentWillReceiveProps({ ...defaultProps, threshold: '200px' });
        expect(instance.state.rootMargin).toBe('200px 0px');
    });
});
