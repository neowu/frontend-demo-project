import {NavigationService} from "app/service/NavigationService";
import {RootState} from "app/type/state";
import {showLoading} from "core-native";
import {Container, Header} from "native-base";
import React from "react";
import {Col, Grid} from "react-native-easy-grid";
import {connect, DispatchProp} from "react-redux";

interface StateProps {
    showGlobalLoading: boolean;
}

interface Props extends StateProps, DispatchProp {
}

class AppMain extends React.PureComponent<Props> {
    // Use pre-stored value, to make sure every render() uses same Context.Provider value
    // Ref: https://reactjs.org/docs/context.html#caveats
    private readonly rootRouter: React.ReactNode = NavigationService.rootRouter();

    // onModalRequestClose is required by Android
    onModalRequestClose = () => {
    };

    render() {
        const {showGlobalLoading} = this.props;
        return (
            <React.Fragment>
                <Container>
                    <Header/>
                    <Grid>
                        <Col style={{backgroundColor: "#635DB7", height: 200}}/>
                        <Col style={{backgroundColor: "#00CE9F", height: 200}}/>
                    </Grid>
                </Container>
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

