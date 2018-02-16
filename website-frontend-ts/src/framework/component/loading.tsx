import React from "react";
import {Spin} from "antd";
import {connect} from "react-redux";

const withLoading = (actionType, Component) => {
    class Loading extends React.PureComponent<any> {
        render() {
            if (this.props.loading) {
                return <Spin/>;
            }
            return Component;
        }
    }

    // Loading.propTypes = {
    //     loading: PropTypes.bool,
    //     children: PropTypes.node
    // };

    return connect((state: any) => ({
        loading: state.loading[actionType]
    }))(Loading);
};

export default withLoading;

export function reducer(state = {}, action) {
    switch (action.type) {
        case "@@framework/LOADING_SHOW":
            return {
                ...state,
                [action.actionType]: true
            };
        case "@@framework/LOADING_HIDE":
            return {
                ...state,
                [action.actionType]: false
            };
        default:
            return state;
    }
}

export function showAction(actionType) {
    return {
        type: "@@framework/LOADING_SHOW",
        actionType
    };
}

export function hideAction(actionType) {
    return {
        type: "@@framework/LOADING_HIDE",
        actionType
    };
}
