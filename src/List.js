import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import Sentinel from './Sentinel';

const AXIS_CSS_MAP = { x: 'overflowX', y: 'overflowY' };

export default class List extends React.PureComponent {
    static propTypes = {
        awaitMore: PropTypes.bool,
        axis: PropTypes.oneOf(['x', 'y']),
        children: PropTypes.func,
        initialIndex: PropTypes.number,
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
        itemsLength: 0,
        itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
        pageSize: 10,
        threshold: '100px',
    };

    constructor(props) {
        super(props);

        this.state = {
            size: this.computeSize(props.pageSize, props.itemsLength),
        };

        this.checkedForIntersection = this.state.size === 0;
    }

    setRef = callback => {
        this.setRootNode = node => {
            const overflow = window.getComputedStyle(node)[AXIS_CSS_MAP[this.props.axis]];
            callback(['auto', 'scroll', 'overlay'].includes(overflow) ? node : null);
        };
    };

    handleUpdate = ({ isIntersecting }) => {
        const { pageSize, itemsLength, onIntersection, awaitMore } = this.props;
        const { size } = this.state;

        if (!this.checkedForIntersection) {
            this.checkedForIntersection = true;
            warning(
                !isIntersecting,
                'The sentinel detected a viewport with a bigger size than the size of its items. This could lead to detrimental behavior, e.g.: triggering more than one `onIntersection` callback at the start.\n' +
                    'To prevent this, use either a bigger `pageSize` value or avoid using the prop `awaitMore` initially.',
            );
        }

        if (isIntersecting) {
            const nextSize = this.computeSize(size + pageSize, itemsLength);
            this.setState({ size: nextSize });

            if (onIntersection && (!awaitMore || this.awaitIntersection)) {
                if (this.awaitIntersection) {
                    this.awaitIntersection = false;
                }
                onIntersection(nextSize, pageSize);
            }
        }
    };

    computeSize(pageSize, itemsLength) {
        return Math.min(pageSize, itemsLength);
    }

    renderItems() {
        const { children, itemsRenderer, initialIndex, itemsLength, threshold, axis, awaitMore } = this.props;
        const { size } = this.state;
        const items = [];

        for (let i = 0; i < size; ++i) {
            items.push(children(initialIndex + i, i));
        }

        let sentinel;
        if (size < itemsLength || awaitMore) {
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

    componentWillReceiveProps({ pageSize, itemsLength }) {
        if (this.props.pageSize !== pageSize || this.props.itemsLength !== itemsLength) {
            const nextSize = this.computeSize(this.state.size + pageSize, itemsLength);
            this.setState({ size: nextSize });
        }
    }

    render() {
        return this.renderItems();
    }
}
