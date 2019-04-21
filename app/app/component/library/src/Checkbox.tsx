import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleSheet, View} from "react-native";
import Icon, {IconClass} from "./Icon";
import Text from "./Text";
import Touchable from "./Touchable";

interface Props {
    checked: boolean;
    onChange: (isChecked: boolean) => void;
    text?: string;
    disabled?: boolean;
}

export default class Checkbox extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        disabled: false,
    };

    onChange = () => this.props.onChange(!this.props.checked);

    render() {
        const {disabled, text, checked} = this.props;
        return (
            <Touchable disabled={disabled} onPress={this.onChange} style={styles.outerContainer}>
                <View style={[styles.container, disabled && styles.disabled]}>{checked && <Icon size="subtitle" color={disabled ? "weak" : "red"} type={IconClass.CHECKED} />}</View>
                {text && <Text style={styles.text}>{text}</Text>}
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 9,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: 18,
        width: 18,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 9,
        backgroundColor: "#ffffff",
    },
    text: {
        marginLeft: 4,
    },
    disabled: {
        borderColor: "rgb(160, 162, 176)",
    },
});
