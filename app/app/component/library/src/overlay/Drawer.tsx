import {PickOptional} from "app/type/definition";
import React from "react";
import {BackHandler, NativeEventSubscription, StyleProp, StyleSheet, ViewStyle} from "react-native";
import Icon, {IconClass} from "../Icon";
import Text from "../Text";
import Touchable from "../Touchable";
import AnimatedView from "./AnimatedView";
import Overlay from "./Overlay";

type Direction = "left" | "right";

export interface Props {
    visible: boolean;
    onClose: () => void;
    beforeClose?: () => void;
    showCollapseButton?: boolean;
    direction?: Direction;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export default class Drawer extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        showCollapseButton: true,
        direction: "right",
    };
    private static readonly animationDirection: {[k in Direction]: [string, string]} = {
        right: ["slideInRight", "slideOutRight"],
        left: ["slideInLeft", "slideOutLeft"],
    };

    private backHandler: NativeEventSubscription | null = null;

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.onClose();
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler!.remove();
    }

    onClose = () => {
        const {beforeClose, onClose} = this.props;
        if (beforeClose) {
            beforeClose();
        }
        onClose();
    };

    render() {
        const {visible, showCollapseButton, children, direction, contentContainerStyle} = this.props;
        const isDirectionRight = direction === "right";
        const backdrop = (
            <Touchable key="left" activeOpacity={1} style={[styles.backdrop, !isDirectionRight && styles.alignRight]} onPress={showCollapseButton ? undefined : this.onClose}>
                {showCollapseButton && (
                    <AnimatedView visible={visible} animations={!isDirectionRight ? Drawer.animationDirection.right : Drawer.animationDirection.left} style={styles.collapseButton}>
                        <Touchable activeOpacity={1} onPress={this.onClose} style={styles.collapseButtonTouch}>
                            <Icon color="lightBlue" style={styles.collapseIcon} type={IconClass.DIRECTION_RIGHT} />
                            <Text size="small">collapse</Text>
                        </Touchable>
                    </AnimatedView>
                )}
            </Touchable>
        );
        const content = (
            <AnimatedView key="right" visible={visible} animations={Drawer.animationDirection[direction!]} style={[styles.contentContainer, contentContainerStyle]}>
                {children}
            </AnimatedView>
        );
        return (
            <Overlay visible={visible} style={styles.overlay}>
                {isDirectionRight ? [backdrop, content] : [content, backdrop]}
            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        flexGrow: 1,
        flexDirection: "row",
    },
    backdrop: {
        flex: 1,
        justifyContent: "center",
    },
    alignRight: {
        alignItems: "flex-end",
    },
    collapseButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "rgb(76, 177, 255)",
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
    },
    collapseButtonTouch: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    collapseIcon: {
        fontSize: 24,
        marginBottom: 2,
    },
    contentContainer: {
        backgroundColor: "#ffffff",
    },
});
