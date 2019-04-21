import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native";
import AddMinusButton from "./AddMinusButton";
import {commonStyles} from "app/util/globalDefinition";

interface Props {
    value: number;
    onChange: (newValue: number) => void;
    precision?: number; // Very important for non-integer, due to precision issues
    min?: number;
    max?: number;
    step?: number;
    editable?: boolean;
    showStepper?: boolean;
    displayRenderer?: (value: number) => string; // Only render when blurs
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

interface State {
    // Used to display editing data, which may be non-numeric.
    // Only blur, or press Enter will trigger onChange.
    internalValue: string;
    isFocused: boolean;
}

export default class NumberInput extends React.PureComponent<Props, State> {
    public static defaultProps: PickOptional<Props> = {
        precision: 2,
        min: 1,
        max: 99999,
        step: 1,
        editable: true,
        displayRenderer: value => value.toLocaleString(),
        disabled: false,
        showStepper: true,
    };

    constructor(props: Props) {
        super(props);
        this.state = {internalValue: props.value.toFixed(props.precision), isFocused: false};
    }

    componentDidUpdate(prevProps: Props) {
        const {value, max, min} = this.props;
        if (value !== prevProps.value || max !== prevProps.max || min !== prevProps.min) {
            this.updateInputValue(value, false);
        }
    }

    onInputFocus = () => this.setState({isFocused: true});

    onInputBlur = () => {
        this.setState({isFocused: false});
        this.updateInputValue(Number(this.state.internalValue), true);
    };

    onInputChange = (newValue: string) => this.setState({internalValue: newValue});

    onInputSubmit = () => this.updateInputValue(Number(this.state.internalValue), false);

    updateInputValue = (newValue: number, shouldRecoverToLastValue: boolean) => {
        const {min, max, value, precision} = this.props;
        if (isNaN(newValue)) {
            if (shouldRecoverToLastValue) {
                this.setState({internalValue: value.toFixed(precision)});
            }
        } else {
            const checkedValue = Math.max(min!, Math.min(max!, newValue));
            this.changeNumberWithPrecision(checkedValue);
        }
    };

    // Without withPrecision, value may become 0.30000001/0.00000001
    withPrecision = (value: number) => parseFloat(value.toFixed(this.props.precision));

    // We can safely say: newValue here has been checked in range
    changeNumberWithPrecision = (newValue: number) => {
        const {value, onChange, precision} = this.props;
        newValue = this.withPrecision(newValue);
        this.setState({internalValue: newValue.toFixed(precision)});
        if (this.withPrecision(value) !== newValue) {
            onChange(newValue);
        }
    };

    canMinus = () => this.withPrecision(this.props.value - this.props.step!) >= this.withPrecision(this.props.min!);

    canAdd = () => this.withPrecision(this.props.value + this.props.step!) <= this.withPrecision(this.props.max!);

    minus = () => this.changeNumberWithPrecision(this.props.value - this.props.step!);

    add = () => this.changeNumberWithPrecision(this.props.value + this.props.step!);

    render() {
        const {disabled, style, editable, value, showStepper, displayRenderer} = this.props;
        const {internalValue, isFocused} = this.state;
        const displayedValue = isFocused ? internalValue : displayRenderer!(this.withPrecision(value));
        return (
            <View style={[styles.container, disabled && styles.containerDisabled, style]}>
                {showStepper && <AddMinusButton type="-" onPress={this.minus} disabled={!this.canMinus()} />}
                <TextInput
                    value={displayedValue}
                    onChangeText={this.onInputChange}
                    onFocus={this.onInputFocus}
                    onBlur={this.onInputBlur}
                    onSubmitEditing={this.onInputSubmit}
                    underlineColorAndroid="transparent"
                    editable={!disabled && editable}
                    keyboardType="numeric"
                    style={[styles.input, disabled && styles.inputDisabled]}
                    disableFullscreenUI
                />
                {showStepper && <AddMinusButton type="+" onPress={this.add} disabled={!this.canAdd()} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 90,
        height: 45,
        borderRadius: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgb(241, 245, 253)",
        borderColor: "white",
        borderWidth: StyleSheet.hairlineWidth,
    },
    containerDisabled: {
        borderColor: "#b6bad180",
        backgroundColor: "#ecedf3",
    },
    input: {
        flex: 1,
        alignItems: "stretch",
        padding: 0,
        textAlign: "center",
        fontSize: 14,
        color: commonStyles.textColor.body,
    },
    inputDisabled: {
        color: commonStyles.textColor.weak,
    },
});
