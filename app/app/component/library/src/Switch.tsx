import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {Animated, Platform, StyleSheet} from "react-native";
import {ThemeContext} from "./theme";
import Touchable from "./Touchable";

interface Props {
    checked: boolean;
    onChange: (isChecked: boolean) => void;
    disabled?: boolean;
}

interface State {
    left: Animated.Value;
    backgroundColor: Animated.Value;
    circleBackgroundColor: Animated.Value;
}

export default class Switch extends React.PureComponent<Props, State> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props> = {
        disabled: false,
    };

    private static config = {
        // background color
        animatedRangeUncheckedDisabled: 0,
        animatedRangeUnchecked: 20,
        animatedRangeCheckedDisabled: 40,
        animatedRangeChecked: 60,
        // circle background color
        animatedRangeCircle: 0,
        animatedRangeCircleDisabled: 20,
        // animation duration
        animationDuration: 300,
    };

    constructor(props: Props) {
        super(props);
        this.state = this.initState(props);
    }

    componentDidUpdate(prevProps: Props) {
        const {checked, disabled} = this.props;
        if (prevProps.checked !== this.props.checked) {
            Animated.parallel([
                Animated.timing(this.state.left, {
                    duration: Switch.config.animationDuration,
                    // 24 => styles.container.width - container.circle.width
                    toValue: checked ? 24 : 0,
                }),
                Animated.timing(this.state.backgroundColor, {
                    duration: Switch.config.animationDuration,
                    toValue: checked ? Switch.config.animatedRangeChecked : Switch.config.animatedRangeUnchecked,
                }),
            ]).start();
        }

        if (prevProps.disabled !== disabled) {
            this.state.backgroundColor.setValue(this.getValue(!!disabled, checked));
            this.state.circleBackgroundColor.setValue(disabled ? Switch.config.animatedRangeCircleDisabled : Switch.config.animatedRangeCircle);
        }
    }

    initState = (props: Props): State => {
        // 24 => styles.container.width - container.circle.width
        const left = new Animated.Value(props.checked ? 24 : 0);
        const backgroundColor = props.checked ? new Animated.Value(!props.disabled ? Switch.config.animatedRangeChecked : Switch.config.animatedRangeCheckedDisabled) : new Animated.Value(!props.disabled ? Switch.config.animatedRangeUnchecked : Switch.config.animatedRangeUncheckedDisabled);
        const circleBackgroundColor = new Animated.Value(props.disabled ? Switch.config.animatedRangeCircleDisabled : Switch.config.animatedRangeCircle);
        return {left, backgroundColor, circleBackgroundColor};
    };

    onChange = () => this.props.onChange(!this.props.checked);

    getValue = (disabled: boolean, checked: boolean) => {
        if (disabled) {
            if (checked) {
                return Switch.config.animatedRangeCheckedDisabled;
            } else {
                return Switch.config.animatedRangeUncheckedDisabled;
            }
        } else {
            if (checked) {
                return Switch.config.animatedRangeChecked;
            } else {
                return Switch.config.animatedRangeUnchecked;
            }
        }
    };

    render() {
        const {disabled} = this.props;
        const themeName = this.context.themeName;
        const backgroundColors = [
            ThemeProvider.getBackgroundColor(this.context.themeName, "switchUncheckedDisabled"),
            ThemeProvider.getBackgroundColor(this.context.themeName, "switchUnchecked"),
            ThemeProvider.getBackgroundColor(this.context.themeName, "switchChecked"),
            ThemeProvider.getBackgroundColor(this.context.themeName, "switchCheckedDisabled"),
        ];
        const circleBackgroundColors = [ThemeProvider.getBackgroundColor(themeName, "switchCircle"), ThemeProvider.getBackgroundColor(themeName, "switchCircleDisabled")];
        return (
            <Touchable disabled={disabled} activeOpacity={1} onPress={this.onChange} style={styles.container}>
                <Animated.View
                    style={[
                        styles.background,
                        {
                            backgroundColor: this.state.backgroundColor.interpolate({
                                inputRange: [Switch.config.animatedRangeUncheckedDisabled, Switch.config.animatedRangeUnchecked, Switch.config.animatedRangeCheckedDisabled, Switch.config.animatedRangeChecked],
                                outputRange: backgroundColors,
                            }),
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.circle,
                        {
                            left: this.state.left,
                            backgroundColor: this.state.circleBackgroundColor.interpolate({
                                inputRange: [Switch.config.animatedRangeCircle, Switch.config.animatedRangeCircleDisabled],
                                outputRange: circleBackgroundColors,
                            }),
                        },
                    ]}
                />
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: 22,
        width: 46,
    },
    background: {
        height: 18,
        width: 44,
        borderRadius: 9,
    },
    circle: {
        position: "absolute",
        height: 22,
        width: 22,
        borderRadius: 11,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.5,
                shadowRadius: 1,
            },
            android: {
                elevation: 4,
            },
        }),
    },
});
