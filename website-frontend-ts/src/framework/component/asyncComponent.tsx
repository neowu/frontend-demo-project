import React, {ComponentType} from "react";
import {defaultLoadingComponent} from "./loadingComponent";

interface Props {
    module: any;
}

interface State {
    Component: React.ComponentType<any>;
}

export function asyncComponent(resolve: () => Promise<ComponentType<any>>, LoadingComponent: React.ComponentType<any> = defaultLoadingComponent): React.ComponentType<any> {
    class AsyncComponent extends React.PureComponent<Props, State> {
        state: State = {
            Component: null
        };

        public componentDidMount() {
            const promise = resolve();
            promise.then(Component => {
                this.setState({Component});
            });
        }

        public render() {
            const {Component} = this.state;
            return Component ? <Component {...this.props} /> : <LoadingComponent {...this.props} />;
        }
    }

    return AsyncComponent;
}
