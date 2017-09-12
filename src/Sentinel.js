import React from 'react';
import Observer from '@researchgate/react-intersection-observer';
import PropTypes from 'prop-types';

export default class Sentinel extends React.PureComponent {
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
            rootMargin: this.computeRootMargin(props),
        };

        props.setRef(this.setRootElement);
    }

    setRootElement = rootElement => {
        this.setState({ rootElement });
    };

    computeRootMargin({ threshold, axis }) {
        const margins = [threshold];
        const unit = threshold.match(/^-?\d*\.?\d+(px|%)$/) || [''];
        const value = `0${unit.pop()}`;
        if (axis === 'y') {
            margins.push(value);
        } else {
            margins.unshift(value);
        }
        return margins.join(' ');
    }

    componentWillReceiveProps(nextProps) {
        const { threshold, axis } = nextProps;
        if (threshold !== this.props.threshold || axis !== this.props.axis) {
            this.setState({
                rootMargin: this.computeRootMargin(nextProps),
            });
        } else {
            this.observer.reobserve();
        }
    }

    render() {
        const { onChange } = this.props;
        const { rootElement, rootMargin } = this.state;

        return (
            <Observer
                ref={node => {
                    this.observer = node;
                }}
                disabled={typeof rootElement === 'undefined'}
                root={rootElement}
                rootMargin={rootMargin}
                onChange={onChange}
            >
                <sentinel style={{ height: 1, display: 'block' }} />
            </Observer>
        );
    }
}
