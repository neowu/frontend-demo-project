import React from "react";
import {BackHandler, NativeEventSubscription, StyleSheet, View} from "react-native";
import AnimatedView from "./AnimatedView";
import Overlay from "./Overlay";

// TODO: title?

export interface Props {
    onClose: () => void;
    visible: boolean;
}

export default class Modal extends React.PureComponent<Props> {
    private backHandler: NativeEventSubscription | null = null;

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.onClose();
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler!.remove();
    }

    render() {
        const {children, visible} = this.props;
        return (
            <Overlay visible={visible} style={styles.alignCenter}>
                <AnimatedView visible={visible} animations={["slideInUp", "slideOutDown"]}>
                    <View style={styles.modalContainer}>{children}</View>
                </AnimatedView>
            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
    alignCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer: {
        borderRadius: 10,
        overflow: "hidden",
        minWidth: 200,
    },
});
