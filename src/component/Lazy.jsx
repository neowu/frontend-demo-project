import React from "react";
import PropTypes from "prop-types";

export default class Lazy extends React.PureComponent {
    state = {Component: null};

    componentWillMount() {
        this.props.module.then((module) => {
            this.setState({Component: module.default});
        });
    }

    render() {
        const {Component} = this.state;
        if (Component === null) {
            return null;
        }
        return <Component {...this.props}/>;
    }
}

Lazy.propTypes = {module: PropTypes.object.isRequired};   // eslint-disable-line react/forbid-prop-types
