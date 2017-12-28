import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class ErrorBoundary extends React.PureComponent {
    state = {
        message: null,
        detail: null
    };

    componentDidCatch(error, errorInfo) {
        this.setState({
            message: error.toString(),
            detail: errorInfo.componentStack
        });
    }

    render() {
        if (this.state.message) {
            return <div>
                <h2>Something went wrong.</h2>
                <details style={{whiteSpace: "pre-wrap"}}>
                    {this.state.message}
                    <br/>
                    {this.state.detail}
                </details>
            </div>;
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.object.isRequired
};

export default connect()(ErrorBoundary);
