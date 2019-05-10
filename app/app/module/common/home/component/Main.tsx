import {RootState} from "app/type/state";
import {Button, Text} from "native-base";
import React from "react";
import {StyleSheet, SafeAreaView, } from "react-native";
import {connect, DispatchProp} from "react-redux";
import {NavigationService} from "app/service/NavigationService";

interface StateProps {}

interface Props extends StateProps, DispatchProp {}

class HomeMain extends React.PureComponent<Props> {
    render() {
        return (
            <SafeAreaView>
                <Button>
                    <Text>Click Me!</Text>
                </Button>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {};
};

export default connect(mapStateToProps)(HomeMain);

const styles = StyleSheet.create({});
