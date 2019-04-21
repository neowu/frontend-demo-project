import React from "react";
import {Dimensions, findNodeHandle, Keyboard, KeyboardEvent, ScrollView, StyleSheet, TextInput, UIManager, View, Platform} from "react-native";
import InternalOverlayManager from "./overlay/InternalOverlayManager";

interface Props {}

interface State {
    keyboardHeight: number;
}

export default class RootView extends React.PureComponent<Props, State> {
    private readonly scrollViewRef: React.RefObject<ScrollView>;

    constructor(props: Props) {
        super(props);
        this.scrollViewRef = React.createRef();
        this.state = {keyboardHeight: 0};
    }

    componentDidMount() {
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow);
        /**
         * ref: https://facebook.github.io/react-native/docs/keyboard
         * Note that if you set android:windowSoftInputMode (in `android/app/src/main/AndroidManifest.xml`) to adjustResize or adjustNothing, only keyboardDidShow and keyboardDidHide events will be available on Android.
         */
        if (Platform.OS === "ios") {
            Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
        } else {
            Keyboard.addListener("keyboardDidHide", this.keyboardWillHide);
        }
    }

    componentWillUnmount() {
        Keyboard.removeAllListeners();
    }

    keyboardDidShow = (event: KeyboardEvent) => {
        const currentFocusedInputHandle = TextInput.State.currentlyFocusedField();
        const rootScrollViewHandle = findNodeHandle(this.scrollViewRef.current);
        if (currentFocusedInputHandle && rootScrollViewHandle) {
            UIManager.measureLayout(
                currentFocusedInputHandle,
                rootScrollViewHandle,
                () => {},
                (left, top) => {
                    const targetY = Math.max(0, Math.min(event.endCoordinates.height, top - 40));
                    this.setState({keyboardHeight: event.endCoordinates.height}, () => {
                        // Fail to work, if calling scrollTo directly
                        setTimeout(() => this.scrollViewRef.current!.scrollTo({x: 0, y: targetY}), 0);
                    });
                }
            );
        }
    };

    keyboardWillHide = () => {
        this.scrollViewRef.current!.scrollTo({x: 0, y: 0, animated: false});
        this.setState({keyboardHeight: 0});
    };

    render() {
        const {children} = this.props;
        const {keyboardHeight} = this.state;
        return (
            <View style={[styles.rootContainer, {marginBottom: keyboardHeight}]}>
                <ScrollView ref={this.scrollViewRef} keyboardShouldPersistTaps="handled" bounces={false} scrollEnabled={keyboardHeight > 0} contentContainerStyle={styles.scrollContainer}>
                    {children}
                    <InternalOverlayManager />
                </ScrollView>
            </View>
        );
    }
}

const deviceHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    scrollContainer: {
        height: deviceHeight,
    },
});
