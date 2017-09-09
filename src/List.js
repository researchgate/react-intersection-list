import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import Sentinel from './Sentinel';

export default class List extends React.PureComponent {
    static propTypes = {
        axis: PropTypes.oneOf(['x', 'y']),
        children: PropTypes.func,
        initialIndex: PropTypes.number,
        itemsLength: PropTypes.number,
        itemsRenderer: PropTypes.func,
        hasMore: PropTypes.bool,
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
        hasMore: false,
        pageSize: 10,
        threshold: '100px',
    };

    constructor(props) {
        super(props);

        this.state = {
            size: this.computeSize(props.pageSize, props.itemsLength),
        };

        this.checkedForIntersection = false;
    }

    setRef = callback => {
        this.setRootNode = callback;
    };

    handleUpdate = ({ isIntersecting }) => {
        const { pageSize, itemsLength, onIntersection } = this.props;
        const { size } = this.state;

        if (!this.checkedForIntersection) {
            this.checkedForIntersection = true;
            warning(
                !isIntersecting,
                'The sentinel detected a very short list size. This will cause a detrimental behavior.\n' +
                    "Make sure to pass a sufficienly large `pageSize` so that the containing elements overflow your list's size",
            );
        }

        if (isIntersecting) {
            const nextSize = this.computeSize(size + pageSize, itemsLength);
            this.setState({ size: nextSize });
            if (onIntersection) {
                onIntersection(nextSize, pageSize);
            }
        }
    };

    computeSize(pageSize, itemsLength) {
        return Math.min(pageSize, itemsLength);
    }

    renderItems() {
        const { children, itemsRenderer, initialIndex, itemsLength, threshold, axis, hasMore } = this.props;
        const { size } = this.state;
        const items = [];

        for (let i = 0; i < size; ++i) {
            items.push(children(initialIndex + i, i));
        }

        let sentinel;
        if (hasMore || size < itemsLength) {
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
        }

        return itemsRenderer(items, node => {
            if (node && sentinel && this.setRootNode) {
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
