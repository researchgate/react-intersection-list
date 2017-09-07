import React from 'react';
import List from '../../../../src';
import Countdown from './Countdown';

const TIMEOUT_MS = 1500;

export default class extends React.Component {
    state = {
        offset: 40,
        isLoading: false,
    };

    handleLoadMore = (offset, limit) => {
        if (this.state.isLoading) {
            return;
        }
        this.setState({
            isLoading: true,
        });
        this.timeout = setTimeout(() => {
            this.setState({
                offset: offset + limit,
                isLoading: false,
            });
        }, TIMEOUT_MS);
    };

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    renderItems = (items, ref) => (
        <div className="list" ref={ref}>
            {items}
        </div>
    );

    renderItem(index, key) {
        return <div key={key}>{index}</div>;
    }

    render() {
        return (
            <div>
                {this.state.isLoading && <Countdown time={TIMEOUT_MS} />}
                <List
                    initialIndex={20}
                    length={this.state.offset}
                    pageSize={20}
                    itemsRenderer={this.renderItems}
                    onIntersection={this.handleLoadMore}
                >
                    {this.renderItem}
                </List>
            </div>
        );
    }
}
