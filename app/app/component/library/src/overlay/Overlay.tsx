import React from "react";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import AnimatedView from "./AnimatedView";

interface Props {
    visible: boolean;
    style?: StyleProp<ViewStyle>;
}

export default class Overlay extends React.PureComponent<Props> {
    render() {
        const {visible, style, children} = this.props;
        return (
            <AnimatedView visible={visible} animations={["fadeIn", "fadeOut"]} style={[style, styles.overlay]}>
                {children}
            </AnimatedView>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        backgroundColor: "#000000cc",
        zIndex: 9999,
    },
});
