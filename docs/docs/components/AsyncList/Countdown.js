import React from 'react';
import PropTypes from 'prop-types';

export default class Countdown extends React.Component {
    static propTypes = {
        time: PropTypes.number.isRequired,
    };

    state = {
        time: this.props.time,
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(prevState => ({
                time: prevState.time - 100,
            }));
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <div className="loading">Loading: {parseFloat(this.state.time / 1000).toFixed(1)}s</div>;
    }
}
