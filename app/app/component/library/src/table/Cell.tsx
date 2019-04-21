import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import ColoredText from "../Text";
import {memoizeTheme, ThemeContext} from "../theme";
import {Align, WidthStyle} from "./Table";

interface Props {
    content?: string | React.ReactElement;
    mode?: "title" | "content" | "multiline-content";
    align?: Align;
    width?: WidthStyle;
}

export default class Cell extends React.PureComponent<Props> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props> = {
        mode: "content",
        align: "center",
        width: {flex: 1},
    };

    getStyle = () => {
        const width = this.props.width!;
        const align = this.props.align!;
        const style: StyleProp<ViewStyle> = "fixed" in width ? {flex: 0, width: width.fixed} : {flex: width.flex};
        style.justifyContent = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
        return style;
    };

    render() {
        const {mode, content} = this.props;
        const styles = styleMapper(this.context.themeName);
        let node: React.ReactNode;
        if (typeof content === "string") {
            if (mode === "title") {
                node = <Text style={styles.headerText}>{content}</Text>;
            } else if (mode === "multiline-content") {
                node = <ColoredText style={styles.multilineContent}>{content}</ColoredText>;
            } else {
                node = <ColoredText numberOfLines={1}>{content}</ColoredText>;
            }
        } else {
            node = content;
        }
        return <View style={[styles.container, this.getStyle()]}>{node}</View>;
    }
}

const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 5,
        },
        headerText: {
            fontWeight: "600",
            fontSize: 12,
            color: ThemeProvider.getTextColor(themeName, "tableHeader"),
        },
        multilineContent: {
            flexWrap: "wrap",
            textAlign: "center",
        },
    })
);
