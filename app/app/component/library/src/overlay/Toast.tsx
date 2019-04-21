import React from "react";
import {StyleSheet, View} from "react-native";
import Text from "../Text";
import AnimatedView from "./AnimatedView";

export default class Toast extends React.PureComponent {
    render() {
        const {children} = this.props;
        const visible = children !== null;
        return (
            <View style={styles.container} pointerEvents="box-none">
                <AnimatedView visible={visible} animations={["fadeIn", "fadeOut"]} style={styles.contentBox}>
                    <Text size="subtitle" color="lightBlue">
                        {children}
                    </Text>
                </AnimatedView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    contentBox: {
        borderWidth: 1,
        width: 240,
        height: 48,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "rgb(76, 177, 255)",
        backgroundColor: "#ffffff",
    },
});
