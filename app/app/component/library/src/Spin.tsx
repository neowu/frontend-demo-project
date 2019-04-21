import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {ActivityIndicator, StyleProp, ViewStyle} from "react-native";
import {ThemeContext} from "./theme";

interface Props {
    size?: "small" | "large";
    style?: StyleProp<ViewStyle>;
    color?: string;
}

export default class Spin extends React.PureComponent<Props> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props> = {
        size: "small",
    };

    render() {
        const {size, style, color: propColor} = this.props;
        const color = propColor || ThemeProvider.getTextColor(this.context.themeName, "body");
        return <ActivityIndicator size={size} color={color} style={style} />;
    }
}
