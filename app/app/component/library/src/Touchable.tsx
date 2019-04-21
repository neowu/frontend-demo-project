import {PickOptional} from "app/type/definition";
import {globalHitSlop} from "app/util/globalDefinition";
import React from "react";
import {GestureResponderEvent, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from "react-native";
import LinearGradient, {LinearGradientProps} from "react-native-linear-gradient";

interface Props extends Partial<LinearGradientProps> {
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    activeOpacity?: number;
    enableHitSlop?: boolean;
}

export default class Touchable extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        disabled: false,
        activeOpacity: 0.75,
        enableHitSlop: true,
    };

    splitStyle = () => {
        const {style} = this.props;
        const outerStyle: StyleProp<ViewStyle> = {};
        const gradientStyle: StyleProp<ViewStyle> = {};
        const borderRadiusStyle: StyleProp<ViewStyle> = {};
        if (style) {
            const flattenedStyle = StyleSheet.flatten(style);
            Object.keys(flattenedStyle).forEach(_ => {
                if (/justifyContent|alignItems|alignContent|flexDirection|flexWrap|(padding*)/.test(_)) {
                    gradientStyle[_] = flattenedStyle[_];
                } else if (/border[a-zA-Z]*Radius/.test(_)) {
                    borderRadiusStyle[_] = flattenedStyle[_];
                } else {
                    outerStyle[_] = flattenedStyle[_];
                }
            });
        }
        return {outerStyle, gradientStyle, borderRadiusStyle};
    };

    renderTouchableOpacity = (children: React.ReactNode, containerStyle: StyleProp<ViewStyle>) => {
        const {enableHitSlop, disabled, onPress, onLayout, activeOpacity} = this.props;
        return (
            <TouchableOpacity hitSlop={enableHitSlop ? globalHitSlop : undefined} onPress={disabled ? undefined : onPress} activeOpacity={disabled ? 1 : activeOpacity} onLayout={onLayout} style={containerStyle}>
                {children}
            </TouchableOpacity>
        );
    };

    render() {
        const {children, style, colors, ...restLinearGradientProps} = this.props;
        if (colors) {
            const {outerStyle, gradientStyle, borderRadiusStyle} = this.splitStyle();
            const gradientComponent = (
                <LinearGradient colors={colors} {...restLinearGradientProps} style={[styles.linearGradient, borderRadiusStyle, gradientStyle]}>
                    {children}
                </LinearGradient>
            );
            return this.renderTouchableOpacity(gradientComponent, [styles.outerContainerForGradient, borderRadiusStyle, outerStyle]);
        } else {
            return this.renderTouchableOpacity(children, style);
        }
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    outerContainerForGradient: {
        overflow: "hidden",
    },
});
