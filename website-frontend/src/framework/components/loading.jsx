import React from "react";
import PropTypes from "prop-types";
import {Spin} from "antd";
import {connect} from "react-redux";

const withLoading = (actionType, Component) => {
    class Loading extends React.PureComponent {
        render() {
            if (this.props.loading) {
                return <Spin/>;
            }
            return Component;
        }
    }

    Loading.propTypes = {
        loading: PropTypes.bool,
        children: PropTypes.node
    };

    return connect(state => ({
        loading: state.loading[actionType]
    }))(Loading);
};

export default withLoading;
