import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleProp, Text as NativeText, TextStyle} from "react-native";
import Touchable from "./Touchable";
import {commonStyles} from "app/util/globalDefinition";

export type Size = "short" | "small" | "normal" | "subtitle" | "title" | "large";

export type Color = "body" | "weak" | "blue" | "lightBlue" | "white" | "red" | "green" | "none";

export interface Props {
    size?: Size;
    color?: Color;
    bold?: boolean;
    onPress?: () => void;
    style?: StyleProp<TextStyle>; // Customized styles are of higher priority
    numberOfLines?: number;
}

export default class Text extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        size: "normal",
        color: "body",
    };

    render() {
        const {style, size, color, bold, onPress, children, ...restTextProps} = this.props;
        const fullStyles: StyleProp<TextStyle> = [
            {
                color: colorRelatedStyle[color!],
                fontSize: sizeRelatedStyles[size!],
                fontWeight: bold ? "bold" : "normal",
            },
            style,
        ];
        if (onPress) {
            return (
                <Touchable onPress={onPress}>
                    <NativeText {...restTextProps} style={fullStyles}>
                        {children}
                    </NativeText>
                </Touchable>
            );
        } else {
            return (
                <NativeText {...restTextProps} style={fullStyles}>
                    {children}
                </NativeText>
            );
        }
    }
}

const sizeRelatedStyles: Record<Size, number> = {
    short: 10,
    small: 12,
    normal: 14,
    subtitle: 18,
    title: 22,
    large: 28,
};

const colorRelatedStyle: Record<Color, string | undefined> = commonStyles.textColor;
