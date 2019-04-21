import {RootView} from "app/component/library";
import {NavigationService} from "app/service/NavigationService";
import {RootState} from "app/type/state";
import {showLoading} from "core-native";
import React from "react";
import {ActivityIndicator, Modal, StyleSheet, View} from "react-native";
import {connect, DispatchProp} from "react-redux";

interface StateProps {
    showGlobalLoading: boolean;
}

interface Props extends StateProps, DispatchProp {}

class AppMain extends React.PureComponent<Props> {
    // Use pre-stored value, to make sure every render() uses same Context.Provider value
    // Ref: https://reactjs.org/docs/context.html#caveats
    private readonly rootRouter: React.ReactNode = NavigationService.rootRouter();

    // onModalRequestClose is required by Android
    onModalRequestClose = () => {};

    render() {
        const {showGlobalLoading} = this.props;
        return (
            <React.Fragment>
                <RootView>{this.rootRouter}</RootView>
                {showGlobalLoading && (
                    <Modal transparent animationType="none" supportedOrientations={["portrait"]} onRequestClose={this.onModalRequestClose}>
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                    </Modal>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    const {currentUser} = state.app.main;
    return {
        showGlobalLoading: showLoading(state),
    };
};

export default connect(mapStateToProps)(AppMain);

const styles = StyleSheet.create({
    loadingOverlay: {
        // If using flex:1, it is not totally full-screen on Android
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000000bb",
        alignItems: "center",
        justifyContent: "center",
    },
});
