import React from 'react';
import List from '../../../../src';

const PAGE_SIZE = 20;

export default class extends React.Component {
    state = {
        page: 0,
        isLoading: false,
        repos: [],
    };

    updateRepos(repos) {
        this.setState({
            isLoading: false,
            repos: [...this.state.repos, ...repos],
        });
    }

    handleLoadMore = () => {
        if (this.state.isLoading) {
            return;
        }
        const nextPage = this.state.page + 1;
        this.setState({
            isLoading: true,
            page: nextPage,
        });

        const etag = sessionStorage.getItem('etag');
        let headers = {};
        if (etag) {
            headers = {
                'If-None-Match': etag,
            };
        }
        fetch(`https://api.github.com/users/researchgate/repos?type=public&per_page=${PAGE_SIZE}&page=${nextPage}`, {
            headers,
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`Failed with status code: ${response.status}`);
                }
                const ifNoneMatch = response.headers['If-None-Match'];
                if (ifNoneMatch) {
                    sessionStorage.setItem('etag', ifNoneMatch);
                }
                return response.json();
            })
            .then(repos => {
                this.updateRepos(repos.filter(repo => repo.fork === false && repo.language));
            })
            .catch(err => {
                throw err;
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
                {repo.name} - {repo.language}
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
                    length={this.state.repos.length}
                    pageSize={PAGE_SIZE}
                    itemsRenderer={this.renderItems}
                    onIntersection={this.handleLoadMore}
                    threshold="0px"
                >
                    {this.renderItem}
                </List>
            </div>
        );
    }
}
