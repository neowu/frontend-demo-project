import {ThemeContext} from "./theme";
import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";

interface Props {
    color?: "default" | "weak";
    isVertical?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default class Line extends React.PureComponent<Props> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props> = {
        color: "default",
        isVertical: false,
    };

    render() {
        const {color, isVertical, style} = this.props;
        const useHairline = color === "weak";
        const sizeStyle = isVertical ? {width: useHairline ? StyleSheet.hairlineWidth : 1} : {height: useHairline ? StyleSheet.hairlineWidth : 1};
        const backgroundColor = ThemeProvider.getBorderColor(this.context.themeName, color === "default" ? "line" : color!);
        return <View style={[{backgroundColor}, sizeStyle, style]} />;
    }
}
