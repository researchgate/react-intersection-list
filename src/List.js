import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import Sentinel from './Sentinel';

const AXIS_CSS_MAP = { x: 'overflowX', y: 'overflowY' };

export default class List extends PureComponent {
    static propTypes = {
        awaitMore: PropTypes.bool,
        axis: PropTypes.oneOf(['x', 'y']),
        children: PropTypes.func,
        initialIndex: PropTypes.number,
        items(props, propName) {
            const object = props[propName];
            if (object != null && !(Array.isArray(object) || typeof object[Symbol.iterator] === 'function')) {
                return new Error(
                    `\`${propName}\` must be of type Array or a native type implementing the iterable interface`,
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

    constructor(props) {
        super(props);

        this.state = {
            size: this.computeSize(props.pageSize, this.getItemCount(props)),
        };

        this.prematureIntersectionChecked = this.state.size === 0;
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
        const { awaitMore, onIntersection, pageSize } = this.props;
        const { size } = this.state;

        if (!this.prematureIntersectionChecked) {
            this.prematureIntersectionChecked = true;
            warning(
                !isIntersecting,
                'ReactIntersectionList: the sentinel detected a viewport with a bigger size than the size of its items. ' +
                    'This could lead to detrimental behavior, e.g.: triggering more than one onIntersection callback at the start.\n' +
                    'To prevent this, use either a bigger `pageSize` value or avoid using the prop awaitMore initially.',
            );
        }

        if (isIntersecting) {
            const nextSize = this.computeSize(size + pageSize, this.getItemCount(this.props));
            if (this.state.size !== nextSize) {
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

    computeSize(pageSize, itemCount) {
        return Math.min(pageSize, itemCount);
    }

    getItemCount({ itemCount, items }) {
        const hasItemCount = typeof itemCount !== 'undefined';
        const hasItems = typeof items !== 'undefined';
        const defaultValue = 0;

        warning(
            !(hasItemCount && hasItems),
            'ReactIntersectionList: cannot use itemCount and items props at the same time, choose one to determine the number of items to render.',
        );

        if (hasItemCount) {
            return itemCount;
        }

        return hasItems ? items.length || items.size || defaultValue : defaultValue;
    }

    getItemRenderer() {
        const { children, renderItem } = this.props;
        const hasChildren = typeof children !== 'undefined';
        const hasRender = typeof renderItem !== 'undefined';

        warning(
            !(hasChildren && hasRender),
            'ReactIntersectionList: cannot use children and renderItem props as render function at the same time.',
        );

        if (hasChildren) {
            return children;
        }

        return hasRender ? renderItem : (index, key) => <div key={key}>{index}</div>;
    }

    renderItems() {
        const { awaitMore, axis, initialIndex, itemsRenderer, threshold } = this.props;
        const { size } = this.state;
        const itemRenderer = this.getItemRenderer();
        const items = [];

        for (let i = 0; i < size; ++i) {
            items.push(itemRenderer(initialIndex + i, i));
        }

        let sentinel;
        if (size < this.getItemCount(this.props) || awaitMore) {
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

    componentWillReceiveProps({ pageSize, ...rest }) {
        const itemCount = this.getItemCount(this.props);
        const nextItemCount = this.getItemCount(rest);

        if (this.props.pageSize !== pageSize || itemCount !== nextItemCount) {
            const nextSize = this.computeSize(this.state.size + pageSize, nextItemCount);
            this.setState({ size: nextSize });
        }
    }

    render() {
        return this.renderItems();
    }
}
