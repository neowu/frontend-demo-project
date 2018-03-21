import React from "react";
import {defaultLoadingComponent} from "./loadingComponent";
import {Components} from "../module";

interface Module {
    default: Components;
}

interface Props {
    module: any;
}

interface State {
    Component: React.ComponentType<any>;
}

export function asyncComponent(resolve: () => Promise<Module>, componentName: string = "Main", LoadingComponent: React.ComponentType<any> = defaultLoadingComponent): React.ComponentType<any> {
    class AsyncComponent extends React.PureComponent<Props, State> {
        state: State = {
            Component: null
        };

        public componentDidMount() {
            const promise = resolve();
            promise.then(module => {
                const Component = module.default[componentName];
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
