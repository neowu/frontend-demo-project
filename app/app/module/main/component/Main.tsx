import {actions} from "app/module/main";
import {Navigation} from "app/module/Navigation";
import {RootState} from "app/type/state";
import {showLoading} from "core-native";
import {Button, Container, Footer, FooterTab, Text} from "native-base";
import React from "react";
import {connect, DispatchProp} from "react-redux";

interface StateProps {
    showGlobalLoading: boolean;
}

interface Props extends StateProps, DispatchProp {}

class AppMain extends React.PureComponent<Props> {
    render() {
        return (
            <Container>
                {Navigation.rootRouter()}
                <Footer>
                    <FooterTab>
                        <Button active onPress={() => this.props.dispatch(actions.navigate("Home"))}>
                            <Text>Home</Text>
                        </Button>
                        <Button onPress={() => this.props.dispatch(actions.navigate("Product"))}>
                            <Text>Product</Text>
                        </Button>
                        <Button onPress={() => this.props.dispatch(actions.navigate("Login"))}>
                            <Text>Login</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
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
