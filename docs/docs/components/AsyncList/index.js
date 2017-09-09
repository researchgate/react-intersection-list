import React from 'react';
import List from '../../../../src';

const PAGE_SIZE = 20;

export default class extends React.Component {
    state = {
        currentPage: 0,
        isLoading: false,
        repos: [],
    };

    feedList(repos) {
        this.setState({
            isLoading: false,
            repos: [...this.state.repos, ...repos],
            hasMore: repos.length > 0,
        });
    }

    handleLoadMore = () => {
        if (this.state.isLoading) {
            return;
        }
        const currentPage = this.state.currentPage + 1;

        this.setState({
            isLoading: true,
            currentPage,
        });

        const url = 'https://api.github.com/users/researchgate/repos';
        const qs = `?type=public&per_page=${PAGE_SIZE}&page=${currentPage}`;

        const headers = {
            'Accept-Encoding': '',
        };
        const ifNoneMatch = sessionStorage.getItem(`etag_${currentPage}`);
        if (ifNoneMatch) {
            headers['If-None-Match'] = ifNoneMatch.match(/(?:\d|[a-z])+/)[0];
        }

        let hasError = false;

        fetch(url + qs, { headers })
            .then(response => {
                if (!(response.status !== 200)) {
                    const etag = response.headers.get(`etag_${currentPage}`);
                    if (etag) {
                        sessionStorage.setItem(`etag_${currentPage}`, etag);
                    }
                } else {
                    hasError = true;
                }
                return response.json();
            })
            .then(repos => {
                if (hasError) {
                    throw new Error(repos.message);
                }
                this.feedList(repos.filter(repo => repo.fork === false && repo.language));
            })
            .catch(err => {
        console.error(err); // eslint-disable-line
            });
    };

    renderItems = (items, ref) => (
        <div className="list list--compact" ref={ref}>
            {items}
        </div>
    );

    renderItem = (index, key) => {
        const repo = this.state.repos[index];
        return (
            <div key={key}>
                <strong>{repo.name}</strong>&nbsp;&nbsp;&lt;{repo.language}&gt;
            </div>
        );
    };

    componentDidMount() {
        this.handleLoadMore();
    }

    render() {
        return (
            <div>
                {this.state.isLoading && <div className="loading">Loading</div>}
                <List
                    itemsRenderer={this.renderItems}
                    itemsLength={this.state.repos.length}
                    hasMore={this.state.hasMore}
                    onIntersection={this.handleLoadMore}
                    pageSize={PAGE_SIZE}
                >
                    {this.renderItem}
                </List>
            </div>
        );
    }
}
