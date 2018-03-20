import React from "react";

interface Props {
    module: any;
}

interface State {
    Component: any;
}

export default class Lazy extends React.PureComponent<Props, State> {
    state: State = {Component: null};

    componentWillMount() {
        this.props.module.then(module => {
            this.setState({Component: module.default});
        });
    }

    render() {
        const {Component} = this.state;
        if (Component === null) {
            return null;
        }
        return <Component {...this.props}/>;
    }
}
