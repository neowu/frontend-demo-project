import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleSheet, Text} from "react-native";
import {memoizeTheme, ThemeContext} from "../theme";
import Touchable from "../Touchable";

export interface Props<T> {
    value: T;
    onPress?: (value: T) => void;
    disabled?: boolean;
    height?: number;
}

export default class Option<T> extends React.PureComponent<Props<T>> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props<any>> = {
        height: 28,
    };

    onPress = () => {
        const {value, onPress, disabled} = this.props;
        if (!disabled) {
            onPress!(value);
        }
    };

    render() {
        const {children, disabled, height} = this.props;
        const styles = styleMapper(this.context.themeName);
        const gradientProps = disabled ? ThemeProvider.getGradientProps(this.context.themeName, "selectOptionDisabled") : ThemeProvider.getGradientProps(this.context.themeName, "selectOption");
        return (
            <Touchable {...gradientProps} enableHitSlop={false} disabled={disabled} style={[styles.container, {height}]} onPress={this.onPress}>
                {React.isValidElement(children) ? children : <Text style={[styles.text, disabled ? styles.disabledTextColor : styles.textColor]}>{children}</Text>}
            </Touchable>
        );
    }
}

const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: ThemeProvider.getBorderColor(themeName, "selectOption"),
        },
        text: {
            fontSize: 12,
        },
        textColor: {
            color: ThemeProvider.getTextColor(themeName, "body"),
        },
        disabledTextColor: {
            color: ThemeProvider.getTextColor(themeName, "weak"),
        },
    })
);
