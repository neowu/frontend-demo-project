import {actions} from "app/module/main";
import {Navigation} from "app/module/Navigation";
import {RootState} from "app/type/state";
import {Button, Container, Text} from "native-base";
import React from "react";
import {connect, DispatchProp} from "react-redux";

interface StateProps {}

interface Props extends StateProps, DispatchProp {
    loggedIn: boolean;
    userName: string | null;
}

class HomeMain extends React.PureComponent<Props> {
    showLoginButton() {
        if (!this.props.loggedIn) {
            return (
                <Button onPress={() => Navigation.switch("Login")}>
                    <Text>Login</Text>
                </Button>
            );
        } else {
            return null;
        }
    }

    showLogoutButton() {
        if (this.props.loggedIn) {
            return (
                <Button onPress={() => this.props.dispatch(actions.logout())}>
                    <Text>Logout</Text>
                </Button>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <Container>
                <Text>Welcome, {this.props.userName}</Text>
                {this.showLoginButton()}
                {this.showLogoutButton()}
            </Container>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        loggedIn: state.app.main.currentUser.loggedIn,
        userName: state.app.main.currentUser.name,
    };
};

export default connect(mapStateToProps)(HomeMain);
