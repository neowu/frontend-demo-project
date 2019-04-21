import {Text, Button} from "app/component/library";
import {RootState} from "app/type/state";
import React from "react";
import {StyleSheet, SafeAreaView} from "react-native";
import {connect, DispatchProp} from "react-redux";
import {NavigationService} from "app/service/NavigationService";

interface StateProps {}

interface Props extends StateProps, DispatchProp {}

class HomeMain extends React.PureComponent<Props> {
    render() {
        return (
            <SafeAreaView>
                <Button text="Login" onPress={() => NavigationService.switch("Login")} />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {};
};

export default connect(mapStateToProps)(HomeMain);

const styles = StyleSheet.create({});
