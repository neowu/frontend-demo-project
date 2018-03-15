import React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {errorAction} from "../action";

export interface Props {
    dispatch: any;
}

export interface State {
    message: string;
}

class ErrorBoundary extends React.PureComponent<Props, State> {
    state = {
        message: ""
    };

    render() {
        if (this.state.message) {
            return <div>failed to render, error: {this.state.message}</div>;
        }
        return this.props.children;
    }

    componentDidCatch(error: Error) {
        this.setState({message: error.message});
        this.props.dispatch(errorAction(error));
    }
}

const mapDispatchToProps = (dispatch: Dispatch<string>) => {
    return {
        dispatch
    };
};

export default connect(null, mapDispatchToProps)(ErrorBoundary);
