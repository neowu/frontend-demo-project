import {RootState} from "app/type/state";
import React from "react";
import {StyleSheet, View} from "react-native";
import {connect, DispatchProp} from "react-redux";

interface StateProps {}

interface Props extends StateProps, DispatchProp {}

class {1} extends React.PureComponent<Props> {
    render() {
        return <View/>;
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {};
};

export default connect(mapStateToProps)({1});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
