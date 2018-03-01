import * as React from "react";
import {connect} from "react-redux";
import {errorAction} from "../action";

export class ReactException {
    public message: string;
    public stack: string;
    public componentStack: string;

    constructor(message, stack, componentStack) {
        this.message = message;
        this.stack = stack;
        this.componentStack = componentStack;
    }
}

interface Props {
    dispatch: any;
    children: JSX.Element;
}

interface State {
    message: string;
}

class ErrorBoundary extends React.PureComponent<Props, State> {
    state: State = {
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

export default connect()(ErrorBoundary);
