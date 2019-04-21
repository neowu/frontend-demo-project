import {PickOptional} from "app/type/definition";
import React from "react";
import {Text, TextColor} from "app/component/library";
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";
import Icon, {IconClass} from "./Icon";
import Touchable from "./Touchable";
import {commonStyles} from "app/util/globalDefinition";

export type Size = "large" | "medium" | "small";
export type Color = "blue" | "white" | "green" | "gray" | "red" | "yellow";

export interface Props {
    text?: string | React.ReactElement;
    icon?: IconClass;
    iconPosition?: "left" | "right";
    onPress?: () => void;
    size?: Size;
    color?: Color;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
    activeOpacity?: number;
}

export default class Button extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        text: "",
        size: "medium",
        iconPosition: "left",
        color: "blue",
        disabled: false,
        activeOpacity: 0.75,
    };

    render() {
        const {onPress, icon, iconPosition, size, color, text, disabled, activeOpacity, style, textStyle: textStyleFromProps, iconStyle} = this.props;
        // Build styles
        const gradientProps = colorRelatedStyles[disabled ? "disabled" : color!];
        const sizeStyle = sizeRelatedStyles[size!];
        const containerStyle = [styles.container, {height: sizeStyle.height, width: sizeStyle.width}, style];
        const textStyle = [{fontSize: sizeStyle.fontSize}, textStyleFromProps];
        const textColor = textRelatedStyles[disabled ? "disabled" : color!];

        // Build text contents
        let textContents: React.ReactNode;
        if (icon && text) {
            const textContentsArray = [
                <Icon color="none" key="icon" type={icon} style={[textStyle, iconStyle]} />,
                <Text key="text" color={textColor as TextColor} style={textStyle}>
                    {" " + text}
                </Text>,
            ];
            if (iconPosition === "right") {
                textContentsArray.reverse();
            }
            textContents = textContentsArray;
        } else if (icon) {
            textContents = <Icon key="_" color="none" type={icon} style={[textStyle, iconStyle]} />;
        } else {
            textContents = (
                <Text color={textColor} style={textStyle}>
                    {text}
                </Text>
            );
        }

        return (
            <Touchable {...gradientProps} activeOpacity={activeOpacity} disabled={disabled} onPress={onPress} style={containerStyle as ViewStyle}>
                {textContents}
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "nowrap",
        borderRadius: commonStyles.number.buttonRadius,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
});

const sizeRelatedStyles: Record<Size, {height: number; fontSize: number; width: number}> = {
    large: {height: 46, fontSize: 20, width: 290},
    medium: {height: 40, fontSize: 14, width: 160},
    small: {height: 22, fontSize: 10, width: 61},
};

const colorRelatedStyles: Record<Color | "disabled", object> = {
    blue: commonStyles.gradient.blueProps,
    white: commonStyles.gradient.whiteProps,
    green: commonStyles.gradient.greenProps,
    gray: commonStyles.gradient.grayPureProps,
    disabled: commonStyles.gradient.grayPureProps,
    red: commonStyles.gradient.redProps,
    yellow: commonStyles.gradient.yellowProps,
};

const textRelatedStyles: Record<Color | "disabled", TextColor> = {
    blue: "white",
    white: "body",
    green: "white",
    gray: "body",
    disabled: "weak",
    red: "white",
    yellow: "white",
};
