import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleSheet, View} from "react-native";
import Text, {Color as TextColor} from "../Text";
import Modal from "./Modal";
import {Touchable} from "../..";

export interface Props {
    visible: boolean;
    body?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    title?: string;
    onOk: () => void;
    onCancel: () => void;
}

export default class ActionModal extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        okText: "ok",
        title: "title",
    };

    onOkayPressed = () => {
        if (this.props.onOk) {
            this.props.onOk();
        }
    };

    renderButton = (color: TextColor, onPress?: () => void, text?: string) => (
        <Touchable onPress={onPress} style={[styles.touchable, text === this.props.cancelText && styles.touchableBorder]}>
            <Text size="subtitle" color={color}>
                {text}
            </Text>
        </Touchable>
    );

    render() {
        const {title, okText, cancelText, onCancel, onOk, body, visible} = this.props;
        let wrappedBody: React.ReactNode;
        if (typeof body === "string") {
            wrappedBody = (
                <View style={styles.simpleTextContainer}>
                    <Text color="none" style={styles.simpleText}>
                        {body}
                    </Text>
                </View>
            );
        } else {
            wrappedBody = body;
        }
        return (
            <Modal visible={visible} onClose={onCancel}>
                <View style={styles.contentContainer}>
                    <Text color="none" size="subtitle" bold style={styles.title}>
                        {title}
                    </Text>
                    {wrappedBody}
                </View>
                <View style={styles.bottomButtonContainer}>
                    {cancelText && this.renderButton("weak", onCancel, cancelText)}
                    {this.renderButton("blue", onOk, okText)}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        width: 270,
        padding: 20,
        backgroundColor: "rgba(248, 248, 248, 0.9)",
    },
    title: {
        textAlign: "center",
    },
    simpleTextContainer: {
        alignItems: "center",
    },
    simpleText: {
        lineHeight: 20,
        textAlign: "center",
    },
    touchable: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    touchableBorder: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(0 ,0 ,0)",
    },
    bottomButtonContainer: {
        width: 270,
        height: 44,
        flexDirection: "row",
        backgroundColor: "rgba(248, 248, 248, 0.9)",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(0, 0, 0)",
    },
});
