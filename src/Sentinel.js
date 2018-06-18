import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
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

        this.target = <span style={{ height: 1, width: 1, display: 'block' }} />;

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
        const { rootMargin: currentRootMargin, rootElement: currentRootElement } = this.state;
        // When the rootMargin stays the same but the sentinel is repositioned, it can fall within
        // its threshold prematurely. In this case we don't get any update from the Observer instance.
        // We need to guarantee an update, and re-observing is a cheap way to accomplish this.
        if (currentRootMargin === rootMargin && currentRootElement === rootElement) {
            this.element.unobserve();
            this.element.observe();
            return false;
        }
        return true;
    }

    setRootElement = rootElement => {
        this.setState({ rootElement });
    };

    render() {
        const { onChange } = this.props;
        const { rootElement, rootMargin } = this.state;

        return (
            <Observer
                ref={node => {
                    this.element = node;
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

// Polyfill your component so the new lifecycles will work with older versions of React:
polyfill(Sentinel);

export default Sentinel;
