import React from "react";
import {connect} from "react-redux";
import {LoadingState} from "../loading";

export const defaultLoadingComponent: React.ComponentType<any> = () => <div>loading...</div>;

export const loadingComponent = (actionType: string, Component: React.ComponentType<any>, LoadingComponent: React.ComponentType<any> = defaultLoadingComponent) => {
    interface Props {
        loading: boolean;
    }

    class Loading extends React.PureComponent<Props> {
        render() {
            if (this.props.loading) {
                return <LoadingComponent {...this.props}/>;
            }
            return <Component {...this.props}/>;
        }
    }

    return connect((state: LoadingState) => ({
        loading: state.loading[actionType] > 0
    }))(Loading);
};
