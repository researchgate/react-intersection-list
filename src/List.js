import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import Sentinel from './Sentinel';
import { getItemCount, computeSize } from './utils';

const AXIS_CSS_MAP = { x: 'overflowX', y: 'overflowY' };

class List extends PureComponent {
    static propTypes = {
        awaitMore: PropTypes.bool,
        axis: PropTypes.oneOf(['x', 'y']),
        children: PropTypes.func,
        initialIndex: PropTypes.number,
        items(props, propName) {
            const object = props[propName];
            if (
                object != null &&
                !(
                    Array.isArray(object) ||
                    typeof object[Symbol.iterator] === 'function'
                )
            ) {
                return new Error(
                    `\`${propName}\` must be of type Array or a native type implementing the iterable interface`
                );
            }
            return undefined;
        },
        itemCount: PropTypes.number,
        itemsRenderer: PropTypes.func,
        onIntersection: PropTypes.func,
        pageSize: PropTypes.number,
        renderItem: PropTypes.func,
        threshold: PropTypes.string,
    };

    static defaultProps = {
        axis: 'y',
        initialIndex: 0,
        itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
        pageSize: 10,
        threshold: '100px',
    };

    state = {
        size: 0,
    };

    static getDerivedStateFromProps({ pageSize, ...props }, prevState) {
        const itemCount = getItemCount(props, true);

        let newSize;
        if (prevState.size === 0) {
            newSize = pageSize;
        } else {
            if (prevState.itemCount < itemCount) {
                newSize = prevState.size + pageSize;
            } else {
                newSize = prevState.size + -(prevState.pageSize - pageSize);
            }
        }

        return {
            pageSize,
            itemCount,
            size: computeSize(newSize, itemCount),
        };
    }

    componentDidMount() {
        this.prematureIntersectionChecked = this.state.size === 0;
    }

    setRef = (callback) => {
        let prevRootNode;
        this.setRootNode = (node) => {
            if (node !== prevRootNode) {
                prevRootNode = node;
                const overflow = window.getComputedStyle(node)[
                    AXIS_CSS_MAP[this.props.axis]
                ];
                callback(
                    ['auto', 'scroll', 'overlay'].indexOf(overflow) !== -1
                        ? node
                        : null
                );
            }
        };
    };

    handleUpdate = ({ isIntersecting }) => {
        const { awaitMore, onIntersection } = this.props;
        const { size, itemCount, pageSize } = this.state;

        if (!this.prematureIntersectionChecked) {
            this.prematureIntersectionChecked = true;
            warning(
                !isIntersecting,
                'ReactIntersectionList: the sentinel detected a viewport with a bigger size than the size of its items. ' +
                    'This could lead to detrimental behavior, e.g.: triggering more than one onIntersection callback at the start.\n' +
                    'To prevent this, use either a bigger `pageSize` value or avoid using the prop awaitMore initially.'
            );
        }

        if (isIntersecting) {
            const nextSize = computeSize(size + pageSize, itemCount);
            if (size !== nextSize) {
                this.setState({ size: nextSize });
            }
            if (onIntersection && (!awaitMore || this.awaitIntersection)) {
                if (this.awaitIntersection) {
                    this.awaitIntersection = false;
                }
                onIntersection(nextSize, pageSize);
            }
        }
    };

    getItemRenderer() {
        const { children, renderItem } = this.props;
        const hasChildren = typeof children !== 'undefined';
        const hasRender = typeof renderItem !== 'undefined';

        warning(
            !(hasChildren && hasRender),
            'ReactIntersectionList: cannot use children and renderItem props as render function at the same time.'
        );

        if (hasChildren) {
            return children;
        }

        return hasRender
            ? renderItem
            : (index, key) => <div key={key}>{index}</div>;
    }

    renderItems() {
        const {
            awaitMore,
            axis,
            initialIndex,
            itemsRenderer,
            threshold,
        } = this.props;
        const { size, itemCount } = this.state;
        const itemRenderer = this.getItemRenderer();
        const items = [];

        for (let i = 0; i < size; ++i) {
            items.push(itemRenderer(initialIndex + i, i));
        }

        let sentinel;
        if (size < itemCount || awaitMore) {
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

        return itemsRenderer(items, (node) => {
            if (node && sentinel) {
                this.setRootNode(node);
            }
        });
    }

    render() {
        return this.renderItems();
    }
}

export default List;
