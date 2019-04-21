import {ThemeProvider} from "app/theme/ThemeProvider";
import {Omit, PickOptional} from "app/type/definition";
import React from "react";
import {NativeSyntheticEvent, StyleProp, StyleSheet, TextInput, TextInputFocusEventData, TextInputProps, View, ViewStyle} from "react-native";
import Icon, {IconClass} from "./Icon";
import Touchable from "./Touchable";
import {commonStyles} from "app/util/globalDefinition";

type Size = "default";

interface OwnProps {
    prefixIcon?: IconClass;
    postfixIcon?: IconClass; // does not work when “allowTogglePasswordMask” and “secureTextEntry” are true
    allowTogglePasswordMask?: boolean; // Only works if secureTextEntry is true
    disabled?: boolean;
    size?: Size;
    showWarningBorder?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

interface ForwardedRefProp {
    forwardedTextInputRef: React.Ref<TextInput>;
}

interface Props extends OwnProps, ForwardedRefProp, TextInputProps {}

interface State {
    isPasswordMaskOn: boolean;
    isFocused: boolean;
}

class Input extends React.PureComponent<Props, State> {
    public static defaultProps: PickOptional<Props> = {
        allowTogglePasswordMask: true,
        size: "default",
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isPasswordMaskOn: !!props.secureTextEntry,
            isFocused: false,
        };
    }

    togglePasswordMask = () => this.setState({isPasswordMaskOn: !this.state.isPasswordMaskOn});

    onInputFocus = (params: NativeSyntheticEvent<TextInputFocusEventData>) => {
        const {onFocus} = this.props;
        this.setState({isFocused: true});
        if (onFocus) {
            onFocus(params);
        }
    };

    onInputBlur = (params: NativeSyntheticEvent<TextInputFocusEventData>) => {
        const {onBlur} = this.props;
        this.setState({isFocused: false});
        if (onBlur) {
            onBlur(params);
        }
    };

    render() {
        const {prefixIcon, allowTogglePasswordMask, containerStyle, disabled, secureTextEntry, forwardedTextInputRef, size, showWarningBorder, postfixIcon, ...restProps} = this.props;
        const {isPasswordMaskOn, isFocused} = this.state;
        const showPasswordToggler = allowTogglePasswordMask && secureTextEntry;
        const fontSizeStyle = {fontSize: sizeRelatedStyles[size!].fontSize};
        return (
            <View style={[styles.container, {height: sizeRelatedStyles[size!].height}, containerStyle, disabled && styles.containerDisabled, isFocused && styles.inputFocus, showWarningBorder && styles.containerWithError]}>
                {prefixIcon && (
                    <View style={[styles.prefixIconBox, disabled && styles.prefixIconBoxDisabled]}>
                        <Icon type={prefixIcon} style={[styles.prefixIcon, disabled && styles.prefixIconDisabled]} />
                    </View>
                )}
                <TextInput
                    {...restProps}
                    ref={forwardedTextInputRef}
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    multiline={false}
                    secureTextEntry={this.state.isPasswordMaskOn}
                    placeholderTextColor={ThemeProvider.getTextColor(this.context.themeName, "weak")}
                    editable={!disabled}
                    style={[styles.input, disabled && styles.inputDisabled, prefixIcon && styles.inputWithPrefix, !showPasswordToggler && styles.inputWidthOutShowPasswordToggler, !showPasswordToggler && postfixIcon && styles.inputWithPostfix, fontSizeStyle, restProps.style]}
                    disableFullscreenUI
                    onFocus={this.onInputFocus}
                    onBlur={this.onInputBlur}
                />
                {showPasswordToggler ? (
                    <Touchable disabled={disabled} onPress={this.togglePasswordMask} style={styles.passwordMaskControlBox}>
                        <Icon type={isPasswordMaskOn ? IconClass.EYE_VISIBLE : IconClass.HIDE_PASSWORD} style={[styles.passwordMaskControlIcon, disabled && styles.passwordMaskControlIconDisabled]} />
                    </Touchable>
                ) : (
                    postfixIcon && (
                        <View style={styles.postfixIconContainer}>
                            <Icon style={fontSizeStyle} type={postfixIcon} />
                        </View>
                    )
                )}
            </View>
        );
    }
}

export default React.forwardRef<TextInput, Omit<Props, keyof ForwardedRefProp>>((props, ref) => <Input forwardedTextInputRef={ref} {...props} />);

const styles = StyleSheet.create({
    container: {
        width: 273,
        flexDirection: "row",
        borderRadius: commonStyles.number.inputRadius,
        borderWidth: 1,
        backgroundColor: commonStyles.backgroundColor.input,
        borderColor: "white",
    },
    containerDisabled: {
        backgroundColor: commonStyles.backgroundColor.inputDisabled,
    },
    containerWithError: {
        borderColor: "#ff2222",
    },
    input: {
        paddingVertical: 0, // Necessary for Android
        paddingLeft: 14,
        flex: 1,
        color: "rgb(65, 69, 98)",
    },
    inputFocus: {
        borderColor: "rgb(71, 165, 238)",
    },
    inputDisabled: {
        color: "rgb(160, 162, 176)",
    },
    inputWithPrefix: {
        paddingLeft: 0,
    },
    inputWithPostfix: {
        paddingRight: 2,
    },
    inputWidthOutShowPasswordToggler: {
        paddingRight: 10,
    },
    prefixIconBox: {
        width: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    prefixIconBoxDisabled: {},
    prefixIcon: {
        fontSize: 20,
        color: "rgb(76, 177, 255)",
    },
    prefixIconDisabled: {
        color: "rgb(160, 162, 176)",
    },
    passwordMaskControlBox: {
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -10,
    },
    passwordMaskControlIcon: {
        fontSize: 26,
        color: "rgb(160, 162, 176)",
    },
    passwordMaskControlIconDisabled: {
        color: "rgba(160, 162, 176, .8)",
    },
    postfixIconContainer: {
        paddingRight: 6,
        justifyContent: "center",
    },
});

const sizeRelatedStyles: Record<Size, {height: number; fontSize: number}> = {
    default: {height: 45, fontSize: 16},
};
