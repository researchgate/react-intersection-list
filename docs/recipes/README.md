## Recipes

### Asynchonous Repo List

When the sentinel comes into view, you can use the callback to load data, create the next items, and attach them. For
this case we're loading Github repositories with pagination. We assume that we don't know the total length and we'll
want to keep fetching until the (unknown) end of the list. The solution here is to pass the prop `awaitMore:bool =
true`, so that the sentinel awaits for more items.

```jsx
import React from 'react';
import List from '@researchgate/react-intersection-list';

const PAGE_SIZE = 20;

export default class extends React.Component {
    state = {
        awaitMore: true,
        isLoading: false,
        currentPage: 0,
        repos: [],
    };

    feedList = repos => {
        this.setState({
            awaitMore: repos.length > 0,
            isLoading: false,
            repos: [...this.state.repos, ...repos],
        });
    };

    handleLoadMore = () => {
        const currentPage = this.state.currentPage + 1;

        this.setState({
            isLoading: true,
            currentPage,
        });

        const url = 'https://api.github.com/users/researchgate/repos';
        const qs = `?type=public&per_page=${PAGE_SIZE}&page=${currentPage}`;

        fetch(url + qs)
            .then(response => response.json())
            .then(this.feedList)
            .catch(err => {
                throw err;
            });
    };

    renderItems = (items, ref) => (
        <div className="list" ref={ref}>
            {items}
        </div>
    );

    renderItem = (index, key) => {
        const repo = this.state.repos[index];
        return (
            <div key={key}>
                <strong>{repo.name}</strong>
            </div>
        );
    };

    render() {
        return (
            <div>
                {this.state.isLoading && <div className="loading">Loading</div>}
                <List
                    awaitMore={this.state.awaitMore}
                    itemsRenderer={this.renderItems}
                    itemCount={this.state.repos.length}
                    onIntersection={this.handleLoadMore}
                    pageSize={PAGE_SIZE}
                    renderItem={this.renderItem}
                />
            </div>
        );
    }
}
```

If the total amount of items are prefetched and available, we won't need `awaitMore` and the `pageSize` will be used to
paginate results until we reach the bottom of the list.

### Infinite Synchronous List

```jsx
import React from 'react';
import List from '@researchgate/react-intersection-list';

export default () => <List itemCount={Infinity}>{(index, key) => <div key={key}>{index}</div>}</List>;
```

### Can I submit a new recipe?

Yes, of course!

1. Fork the code repo.
2. Create your new recipe in the correct subfolder within `./docs/docs/components/` (create a new folder if it doesn't
   already exist).
3. Make sure you have included a README as well as your source file.
4. Submit a PR.

_If you haven't yet, please read our
[contribution guidelines](https://github.com/researchgate/react-intersection-list/blob/master/.github/CONTRIBUTING.md)._

### What license are the recipes released under?

By default, all newly submitted code is licensed under the MIT license.

### How else can I contribute?

Recipes don't always have to be code - great documentation, tutorials, general tips and even general improvements to our
examples folder are greatly appreciated.
