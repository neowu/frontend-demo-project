import {RootState} from "app/type/state";
import {Button, Col, Container, Grid, Header, Text} from "native-base";
import React from "react";
import {StyleSheet} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {connect, DispatchProp} from "react-redux";
import {actions} from "../index";

interface StateProps {}

interface Props extends StateProps, DispatchProp {
    navigation: NavigationScreenProp<any, any>;
}

class HomeMain extends React.PureComponent<Props> {
    render() {
        return (
            <React.Fragment>
                <Container>
                    <Header />
                    <Grid>
                        <Col style={{backgroundColor: "#635DB7", height: 200}} />
                        <Col style={{backgroundColor: "#00CE9F", height: 200}} />
                        <Button onPress={() => this.props.dispatch(actions.goLogin())}>
                            <Text>Click Me!</Text>
                        </Button>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {};
};

export default connect(mapStateToProps)(HomeMain);

const styles = StyleSheet.create({});
