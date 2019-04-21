import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleProp, StyleSheet, Text as NativeText, View, ViewStyle} from "react-native";
import {memoizeTheme, ThemeContext} from "./theme";
import Touchable from "./Touchable";

interface Props {
    count?: number;
    /**
     * maxDigitLength:
     *  0: only a red point
     *  1: show 0~9, as 9+
     *  2: show 0~99, larger as 99+
     */
    maxDigitLength?: 0 | 1 | 2;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default class Badge extends React.PureComponent<Props> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props> = {
        maxDigitLength: 1,
    };

    renderPoint = () => {
        const styles = styleMapper(this.context.themeName);
        return <View style={styles.point} />;
    };

    renderBadge = (count: number, maxCount: number) => {
        const text = count > maxCount ? maxCount + "+" : count.toString();
        const styles = styleMapper(this.context.themeName);
        return (
            <View style={styles.badge}>
                <NativeText style={styles.text}>{text}</NativeText>
            </View>
        );
    };

    render() {
        const {style, maxDigitLength, count, children} = this.props;
        return (
            <Touchable style={style}>
                {children}
                {count && count > 0 ? (maxDigitLength === 0 ? this.renderPoint() : this.renderBadge(count, maxDigitLength === 1 ? 9 : 99)) : null}
            </Touchable>
        );
    }
}

const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        badge: {
            height: 18,
            position: "absolute",
            top: -7,
            right: -5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "red"),
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 9,
        },
        text: {
            color: "#fff",
            fontSize: 10,
        },
        point: {
            width: 6,
            height: 6,
            borderRadius: 3,
            position: "absolute",
            top: -2,
            right: -2,
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "red"),
        },
    })
);
