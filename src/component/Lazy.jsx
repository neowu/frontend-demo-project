import React from "react";
import PropTypes from "prop-types";

export default class Lazy extends React.Component {
    state = {module: null};

    componentWillMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps);
        }
    }

    load(props) {
        this.setState({module: null});
        props.load((module) => {
            this.setState({module: module.default});
        });
    }

    render() {
        return this.props.children(this.state.module);
    }
}

Lazy.propTypes = {
    load: PropTypes.any.isRequired,
    children: PropTypes.any.isRequired
};
