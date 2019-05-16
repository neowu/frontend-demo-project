import {LoginComponent} from "app/module/common/login";
import {NavigationService} from "app/service/NavigationService";
import {RootState} from "app/type/state";
import {showLoading} from "core-native";
import React from "react";
import {createAppContainer, createStackNavigator, NavigationContainerComponent, NavigationScreenProp} from "react-navigation";
import {connect, DispatchProp} from "react-redux";
import {HomeComponent} from "../../common/home";

interface StateProps {
    showGlobalLoading: boolean;
}

interface Props extends StateProps, DispatchProp {
    navigation: NavigationScreenProp<any, any>;
}

class AppMain extends React.PureComponent<Props> {
    render() {
        return <AppContainer ref={(_: NavigationContainerComponent) => (NavigationService.rootNavigator = _)} />;
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    const {currentUser} = state.app.main;
    return {
        showGlobalLoading: showLoading(state),
    };
};

const MainNavigator = createStackNavigator({
    Home: {screen: HomeComponent},
    Login: {screen: LoginComponent},
});

const AppContainer = createAppContainer(MainNavigator);

export default connect(mapStateToProps)(AppMain);
