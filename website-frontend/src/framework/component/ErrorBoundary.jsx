import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {errorAction} from "../action";

export function ReactException(message, stack, componentStack) {
    this.message = message;
    this.stack = stack;
    this.componentStack = componentStack;
    return this;
}

class ErrorBoundary extends React.PureComponent {
    state = {
        message: null
    };

    componentDidCatch(error, errorInfo) {
        this.setState({message: error.message});
        this.props.dispatch(errorAction(new ReactException(error.message, error.stack, errorInfo.componentStack)));
    }

    render() {
        if (this.state.message) {
            return <div>failed to render, error: {this.state.message}</div>;
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    dispatch: PropTypes.func,
    children: PropTypes.object.isRequired
};

export default connect()(ErrorBoundary);
