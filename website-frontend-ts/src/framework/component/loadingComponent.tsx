import React from "react";
import {connect} from "react-redux";
import {LoadingState} from "../loading";

export const defaultLoadingComponent: React.ComponentType<any> = () => <div>loading...</div>;

export function loadingComponent(loading: string, Component: React.ComponentType<any>, LoadingComponent: React.ComponentType<any> = defaultLoadingComponent): React.ComponentType<any> {
    interface Props {
        show: boolean;
    }

    class Loading extends React.PureComponent<Props> {
        render() {
            return this.props.show ? <LoadingComponent/> : <Component/>;
        }
    }

    return connect((state: LoadingState) => {
        const show = state.loadings[loading] > 0;
        return {show};
    })(Loading);
}
