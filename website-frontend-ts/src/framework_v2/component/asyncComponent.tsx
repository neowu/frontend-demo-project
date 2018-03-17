import * as React from "react";
import {Components} from "../type";

interface Module {
    default: Components;
}

interface Props {
    module: any;
}

interface State {
    Component: React.ComponentType<any>;
}

const defaultLoadingComponent = () => <div>loading...</div>;

export function asyncComponent(resolve: () => Promise<Module>, componentName: string = "Main", loadingComponent: React.ComponentType<any> = defaultLoadingComponent): React.ComponentType<any> {
    class AsyncComponent extends React.PureComponent<Props, State> {
        state: State = {Component: null};

        public componentDidMount() {
            const promise = resolve();
            promise.then(module => {
                const Component = module.default[componentName];
                this.setState({Component});
            });
        }

        public render() {
            const {Component} = this.state;
            const Loading = loadingComponent;
            return Component ? <Component {...this.props} /> : <Loading {...this.props} />;
        }
    }

    return AsyncComponent;
}
