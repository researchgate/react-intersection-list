import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import Sentinel from './Sentinel';

const AXIS_CSS_MAP = { x: 'overflowX', y: 'overflowY' };

function getLengthProp(props) {
    return typeof props.itemsLength !== 'undefined' ? props.itemsLength || 0 : props.currentLength;
}

export default class List extends React.PureComponent {
    static propTypes = {
        awaitMore: PropTypes.bool,
        axis: PropTypes.oneOf(['x', 'y']),
        children: PropTypes.func,
        initialIndex: PropTypes.number,
        currentLength: PropTypes.number,
        itemsLength: PropTypes.number,
        itemsRenderer: PropTypes.func,
        onIntersection: PropTypes.func,
        pageSize: PropTypes.number,
        threshold: PropTypes.string,
    };

    static defaultProps = {
        axis: 'y',
        children: (index, key) => <div key={key}>{index}</div>,
        initialIndex: 0,
        currentLength: 0,
        itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
        pageSize: 10,
        threshold: '100px',
    };

    constructor(props) {
        super(props);

        warning(
            !props.hasOwnProperty('itemsLength'),
            'ReactIntersectionList: [deprecation] Use currentLength instead of itemsLength. This prop will be removed in the next major version.',
        );

        this.state = {
            size: this.computeSize(props.pageSize, getLengthProp(props)),
        };

        this.checkedForIntersection = this.state.size === 0;
    }

    setRef = callback => {
        let prevRootNode;
        this.setRootNode = node => {
            if (node !== prevRootNode) {
                prevRootNode = node;
                const overflow = window.getComputedStyle(node)[AXIS_CSS_MAP[this.props.axis]];
                callback(['auto', 'scroll', 'overlay'].indexOf(overflow) !== -1 ? node : null);
            }
        };
    };

    handleUpdate = ({ isIntersecting }) => {
        const { pageSize, onIntersection, awaitMore } = this.props;
        const currentLength = getLengthProp(this.props);
        const { size } = this.state;

        if (!this.checkedForIntersection) {
            this.checkedForIntersection = true;
            warning(
                !isIntersecting,
                'ReactIntersectionList: the sentinel detected a viewport with a bigger size than the size of its items. ' +
                    'This could lead to detrimental behavior, e.g.: triggering more than one onIntersection callback at the start.\n' +
                    'To prevent this, use either a bigger `pageSize` value or avoid using the prop awaitMore initially.',
            );
        }

        if (isIntersecting) {
            const nextSize = this.computeSize(size + pageSize, currentLength);
            this.setState({ size: nextSize });

            if (onIntersection && (!awaitMore || this.awaitIntersection)) {
                if (this.awaitIntersection) {
                    this.awaitIntersection = false;
                }
                onIntersection(nextSize, pageSize);
            }
        }
    };

    computeSize(pageSize, currentLength) {
        return Math.min(pageSize, currentLength);
    }

    renderItems() {
        const { children, itemsRenderer, initialIndex, threshold, axis, awaitMore } = this.props;
        const currentLength = getLengthProp(this.props);
        const { size } = this.state;
        const items = [];

        for (let i = 0; i < size; ++i) {
            items.push(children(initialIndex + i, i));
        }

        let sentinel;
        if (size < currentLength || awaitMore) {
            sentinel = (
                <Sentinel
                    key="sentinel"
                    threshold={threshold}
                    axis={axis}
                    setRef={this.setRef}
                    onChange={this.handleUpdate}
                />
            );
            items.push(sentinel);

            if (awaitMore) {
                this.awaitIntersection = true;
            }
        }

        return itemsRenderer(items, node => {
            if (node && sentinel) {
                this.setRootNode(node);
            }
        });
    }

    componentWillReceiveProps({ pageSize, ...nextProps }) {
        const currentLength = getLengthProp(this.props);
        const nextCurrentLength = getLengthProp(nextProps);

        if (this.props.pageSize !== pageSize || currentLength !== nextCurrentLength) {
            const nextSize = this.computeSize(this.state.size + pageSize, nextCurrentLength);
            this.setState({ size: nextSize });
        }
    }

    render() {
        return this.renderItems();
    }
}
