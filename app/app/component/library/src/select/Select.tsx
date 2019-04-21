import {ThemeProvider} from "app/theme/ThemeProvider";
import {Omit, PickOptional} from "app/type/definition";
import React from "react";
import {Dimensions, GestureResponderEvent, LayoutChangeEvent, Modal, NativeTouchEvent, Platform, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import Icon, {IconClass} from "../Icon";
import {memoizeTheme, ThemeContext} from "../theme";
import Touchable from "../Touchable";
import Option, {Props as OptionProps} from "./Option";

interface Props<T> {
    value: T;
    onSelect: (value: T) => void;
    placeholder?: string;
    optionsContainerPosition?: "up" | "down";
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

interface State {
    visible: boolean;
    optionsPosition: {top?: number; bottom?: number; left?: number; right?: number};
}

class Select<T> extends React.PureComponent<Props<T>, State> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props<any>> = {
        optionsContainerPosition: "down",
    };
    public static Option: React.ComponentClass<Omit<OptionProps<any>, "onPress">> = Option;

    private selectSize: {width: number; height: number} = {width: 0, height: 0};

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            visible: false,
            optionsPosition: {},
        };
    }

    showOptions = (event: GestureResponderEvent) => {
        const position = {
            ...this.getOptionsPositionVertical(event.nativeEvent),
            left: event.nativeEvent.pageX - event.nativeEvent.locationX,
        };

        this.setState({
            visible: true,
            optionsPosition: position,
        });
    };

    hideOptions = () => {
        this.setState({
            visible: false,
        });
    };

    onLayout = (event: LayoutChangeEvent) => {
        this.selectSize = {
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
        };
    };

    onSelect = (value: T) => {
        if (value !== this.props.value) {
            this.hideOptions();
            this.props.onSelect(value);
        }
    };

    getSelectOffset = (pageY: number, locationY: number) => {
        const windowHeight = Dimensions.get("window").height;
        return {
            top: pageY - locationY,
            bottom: windowHeight - pageY - (this.selectSize.height - locationY),
        };
    };

    getOptionsPositionVertical = (nativeEvent: NativeTouchEvent) => {
        const offset = this.getSelectOffset(nativeEvent.pageY, nativeEvent.locationY);
        if (this.props.optionsContainerPosition === "down") {
            return {top: nativeEvent.pageY - nativeEvent.locationY + this.selectSize.height + 4}; // +1: container borderWidth
        } else {
            // On Android, if StatusBar don't hidden, should minus StatusBar.currentHeight, example: return {bottom: offset.bottom + this.selectSize.height - StatusBar.currentHeight};
            return {bottom: offset.bottom + this.selectSize.height + 4}; // +1: container borderWidth
        }
    };

    getSelectedContent = () => {
        const {children, value} = this.props;
        const currentContent = React.Children.map(children, item => item)
            .filter(item => {
                const ite = item as React.ReactElement<OptionProps<T>>;
                return ite.props.value === value;
            })
            .map(item => {
                const ite = item as React.ReactElement<OptionProps<T> & {children: string}>;
                return ite.props.children;
            });
        return currentContent[0];
    };

    render() {
        const {children, value, disabled, placeholder, containerStyle, optionsContainerPosition} = this.props;
        const {optionsPosition, visible} = this.state;
        const styles = styleMapper(this.context.themeName);
        const content = this.getSelectedContent();
        const optionPositionBottom = optionsContainerPosition === "down";
        return (
            <React.Fragment>
                <View style={[styles.container, disabled ? styles.disabledContainer : styles.normalContainer, containerStyle]}>
                    <Text style={[styles.text, disabled ? styles.disabledTextColor : styles.textColor]}>{!value && placeholder ? placeholder : content}</Text>
                    <Icon type={visible ? IconClass.TRIANGLE_SOLID_UP : IconClass.TRIANGLE_SOLID_DOWN} style={[styles.collapseIcon, {transform: [{rotateZ: optionPositionBottom ? "0deg" : "180deg"}]}, disabled ? styles.disabledTextColor : styles.textColor]} />
                    <Touchable disabled={disabled} onPress={this.showOptions} onLayout={this.onLayout} style={StyleSheet.absoluteFill} />
                </View>
                <Modal visible={visible} supportedOrientations={["portrait", "landscape"]} transparent onRequestClose={this.hideOptions}>
                    <Touchable activeOpacity={1} style={styles.optionsTouchView} onPress={this.hideOptions}>
                        <View style={[styles.optionsContainer, {width: this.selectSize.width}, optionsPosition]}>{React.Children.map(children, (item, index) => React.cloneElement(item as React.ReactElement<OptionProps<T>>, {key: index, onPress: this.onSelect}))}</View>
                    </Touchable>
                </Modal>
            </React.Fragment>
        );
    }
}

const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 122,
            height: 28,
            paddingRight: 10,
            borderWidth: 1,
            borderRadius: 99,
        },
        normalContainer: {
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "select"),
            borderColor: ThemeProvider.getBorderColor(themeName, "select"),
        },
        disabledContainer: {
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "selectDisabled"),
            borderColor: ThemeProvider.getBorderColor(themeName, "selectDisabled"),
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
        collapseIcon: {
            position: "absolute",
            alignSelf: "center",
            right: 8,
            fontSize: 14,
        },
        optionsContainer: {
            position: "absolute",
            borderTopWidth: StyleSheet.hairlineWidth,
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderRightWidth: StyleSheet.hairlineWidth,
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "mainContent"),
            ...Platform.select({
                ios: {
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 4,
                },
            }),
            borderColor: ThemeProvider.getBorderColor(themeName, "selectOption"),
        },
        optionsTouchView: {
            flex: 1,
        },
    })
);

export default Select;
