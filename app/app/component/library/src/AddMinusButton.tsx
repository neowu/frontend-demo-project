import React from "react";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import Icon, {IconClass} from "./Icon";
import Touchable from "./Touchable";
import {commonStyles} from "app/util/globalDefinition";

interface Props {
    type: "-" | "+";
    disabled?: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

export default class AddMinusButton extends React.PureComponent<Props> {
    render() {
        const {type, disabled, onPress, style} = this.props;
        const gradientProps = disabled ? commonStyles.gradient.grayPureProps : commonStyles.gradient.whiteProps;
        const icon = type === "-" ? IconClass.MINUS : IconClass.PLUS;
        return (
            <Touchable disabled={disabled} onPress={onPress} {...gradientProps} style={[styles.button, disabled ? styles.disabledBorderColor : styles.borderColor, style]}>
                <Icon type={icon} style={[styles.buttonText, disabled ? styles.disabledTextColor : styles.textColor]} />
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        height: 41,
        width: 28,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    buttonText: {
        fontSize: 10,
        color: "rgb(51, 170, 146)",
    },
    borderColor: {borderColor: "#b6bad1"},
    disabledBorderColor: {borderColor: "#b6bad180"},
    textColor: {color: "rgb(51, 170, 146)"},
    disabledTextColor: {color: "#fff"},
});
