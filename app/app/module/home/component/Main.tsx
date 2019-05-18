import {RootState} from "app/type/state";
import {Button, Container, Text} from "native-base";
import React from "react";
import {StyleSheet} from "react-native";
import {connect, DispatchProp} from "react-redux";
import {actions} from "../index";

interface StateProps {}

interface Props extends StateProps, DispatchProp {
    userName: string | null;
}

class HomeMain extends React.PureComponent<Props> {
    showLoginButton() {
        if (this.props.userName !== null) {
            return null;
        } else {
            return (
                <Button onPress={() => this.props.dispatch(actions.goLogin())}>
                    <Text>Login</Text>
                </Button>
            );
        }
    }

    render() {
        return (
            <Container>
                <Text>Welcome, {this.props.userName}</Text>
                {this.showLoginButton()}
            </Container>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        userName: state.app.main.currentUser.name,
    };
};

export default connect(mapStateToProps)(HomeMain);

const styles = StyleSheet.create({});
