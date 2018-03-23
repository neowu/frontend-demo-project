import React from "react";
import {connect} from "react-redux";
import {LoadingState} from "../loading";

export const defaultLoadingComponent: React.ComponentType<any> = () => <div>loading...</div>;

export const loadingComponent = (loading: string, Component: React.ComponentType<any>, LoadingComponent: React.ComponentType<any> = defaultLoadingComponent) => {
    interface Props {
        show: boolean;
    }

    class Loading extends React.PureComponent<Props> {
        render() {
            if (this.props.show) {
                return <LoadingComponent {...this.props}/>;
            }
            return <Component {...this.props}/>;
        }
    }

    return connect((state: LoadingState) => {
        const show = state.loadings[loading] > 0;
        return {show};
    })(Loading);
};
