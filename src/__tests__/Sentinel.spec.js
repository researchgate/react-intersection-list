/* eslint-env jest */
import 'intersection-observer';
import React from 'react';
import renderer from 'react-test-renderer';
import Sentinel from '../Sentinel';
import { computeRootMargin } from '../utils';

jest.mock('@researchgate/react-intersection-observer');

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
        const utils = require('../utils');
        const original = utils.computeRootMargin;
        const computeRootMarginSpy = jest.fn();
        utils.computeRootMargin = computeRootMarginSpy;
        const TestSentinel = require('../Sentinel').default;
        const renderMock = jest.spyOn(TestSentinel.prototype, 'render').mockImplementation(() => {});
        const setRefMock = jest.fn();
        const props = { setRef: setRefMock };
        const tree = renderer.create(<TestSentinel {...props} />);

        expect(computeRootMarginSpy).toBeCalledWith(props);
        expect(setRefMock).toBeCalledWith(tree.getInstance().setRootElement);

        computeRootMarginSpy.mockRestore();
        renderMock.mockRestore();

        utils.computeRootMargin = original;
    });
});

describe('render', () => {
    test('first time sets a disabled observer', () => {
        const spy = require('@researchgate/react-intersection-observer').default;
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
        tree.getInstance().element = {
            reobserve: spy,
        };
        tree.update(<Sentinel {...defaultProps} />);
        expect(renderSpy).not.toBeCalled();
        expect(spy).toBeCalled();
    });
});

describe('compute', () => {
    test('returns computed rootMargin', () => {
        expect(computeRootMargin({ threshold: '50%', axis: 'x' })).toBe('0% 50%');
        expect(computeRootMargin({ threshold: '50px', axis: 'y' })).toBe('50px 0px');
        expect(computeRootMargin({ threshold: '50', axis: 'y' })).toBe('50 0');
    });

    test('new axis or threshold props update rootMargin', () => {
        const tree = createTree();
        const instance = tree.getInstance();
        let prevRootMargin = instance.state.rootMargin;

        tree.update(<Sentinel {...{ ...defaultProps, axis: 'x' }} />);
        expect(prevRootMargin).not.toBe(instance.state.rootMargin);

        prevRootMargin = instance.state.rootMargin;

        tree.update(<Sentinel {...{ ...defaultProps, threshold: '200px' }} />);
        expect(prevRootMargin).not.toBe(instance.state.rootMargin);
    });
});
