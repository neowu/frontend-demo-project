import {memoizeTheme, ThemeContext} from "./theme";
import Text from "./Text";
import {ThemeProvider} from "app/theme/ThemeProvider";
import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import * as Animatable from "react-native-animatable";

interface Props {
    label?: string;
    postfix?: string | React.ReactElement;
    errorMessage?: string | null;
    containerStyle?: StyleProp<ViewStyle>;
}

interface State {
    errorAnimation: string;
}

export default class FormRow extends React.PureComponent<Props, State> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;

    constructor(props: Props) {
        super(props);
        this.state = {errorAnimation: ""};
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.errorMessage !== this.props.errorMessage && this.props.errorMessage) {
            this.setState({errorAnimation: "shake"});
        }
    }

    onAnimationEnd = () => this.setState({errorAnimation: ""});

    render() {
        const {label, postfix, children, errorMessage, containerStyle} = this.props;
        const styles = styleMapper(this.context.themeName);
        return (
            <View style={[styles.container, containerStyle]}>
                <View style={styles.rowContainer}>
                    {label !== undefined && <Text style={styles.label}>{label}</Text>}
                    {children && (
                        <Animatable.View animation={this.state.errorAnimation} onAnimationEnd={this.onAnimationEnd} style={styles.content}>
                            {children}
                        </Animatable.View>
                    )}
                    {typeof postfix === "string" ? <Text>{postfix}</Text> : postfix}
                </View>
                {!!errorMessage && (
                    <Text numberOfLines={2} size="small" style={[styles.errorMessage, label !== undefined && styles.errorMessageWithLabel]}>
                        {errorMessage}
                    </Text>
                )}
            </View>
        );
    }
}

const labelWidth = 100;
const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        container: {
            marginBottom: 12,
        },
        rowContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        label: {
            width: labelWidth,
            textAlign: "right",
            paddingRight: 10,
        },
        content: {
            marginRight: 6,
        },
        errorMessage: {
            marginTop: 3,
            color: ThemeProvider.getTextColor(themeName, "red"),
        },
        errorMessageWithLabel: {
            marginLeft: labelWidth,
        },
    })
);
