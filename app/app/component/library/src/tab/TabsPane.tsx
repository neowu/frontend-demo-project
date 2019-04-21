import React from "react";

export interface TabsPaneProps {
    tabKey: string;
    title: string;
}

export default class TabsPane extends React.PureComponent<TabsPaneProps> {
    render() {
        return this.props.children;
    }
}
