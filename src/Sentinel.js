import React, { Component } from 'react';
import { IntersectionObserver as Observer } from '@researchgate/react-intersection-observer/lib/js/IntersectionObserver';
import PropTypes from 'prop-types';
import { computeRootMargin } from './utils';

class Sentinel extends Component {
    static propTypes = {
        axis: PropTypes.oneOf(['x', 'y']).isRequired,
        threshold: PropTypes.string.isRequired,
        setRef: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            rootElement: undefined,
            rootMargin: computeRootMargin(props),
        };

        this.target = (
            <template style={{ height: 1, minWidth: 1, display: 'block' }} />
        );

        props.setRef(this.setRootElement);
    }

    static getDerivedStateFromProps({ threshold, axis }, prevState) {
        let newState = null;
        if (threshold !== prevState.threshold || axis !== prevState.axis) {
            newState = {
                threshold,
                axis,
                rootMargin: computeRootMargin({ threshold, axis }),
            };
        }
        return newState;
    }

    shouldComponentUpdate(nextProps, { rootMargin, rootElement }) {
        const {
            rootMargin: currentRootMargin,
            rootElement: currentRootElement,
        } = this.state;
        // When the rootMargin stays the same but the sentinel is repositioned, it can fall within
        // its threshold prematurely. In this case we don't get any update from the Observer instance.
        // We need to guarantee an update, and re-observing is a cheap way to accomplish this.
        if (
            currentRootMargin === rootMargin &&
            currentRootElement === rootElement
        ) {
            this.observer.externalUnobserve();
            this.observer.observe();
            return false;
        }
        return true;
    }

    setRootElement = (rootElement) => {
        this.setState({ rootElement });
    };

    render() {
        const { onChange } = this.props;
        const { rootElement, rootMargin } = this.state;

        return (
            <Observer
                ref={(instance) => {
                    this.observer = instance;
                }}
                disabled={typeof rootElement === 'undefined'}
                root={rootElement}
                rootMargin={rootMargin}
                onChange={onChange}
            >
                {this.target}
            </Observer>
        );
    }
}

export default Sentinel;
