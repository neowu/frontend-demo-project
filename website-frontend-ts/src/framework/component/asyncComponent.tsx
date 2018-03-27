import React, {ComponentType} from "react";
import {defaultLoadingComponent} from "./loadingComponent";

interface State {
    Component: React.ComponentType<any>;
}

export function asyncComponent(resolve: () => Promise<ComponentType<any>>, LoadingComponent: React.ComponentType<any> = defaultLoadingComponent): React.ComponentType<{}> {
    class Async extends React.PureComponent<{}, State> {
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
            return Component ? <Component/> : <LoadingComponent/>;
        }
    }

    return Async;
}
