import * as React from "react";
import {createAppContainer, createStackNavigator, NavigationActions, NavigationContainerComponent} from "react-navigation";
import {HomeComponent} from "./common/home";
import {LoginComponent} from "./common/login";

const MainNavigator = createStackNavigator({
    Home: {screen: HomeComponent},
    Login: {screen: LoginComponent},
});

const AppContainer = createAppContainer(MainNavigator);

export class Navigation {
    // Registered root-level navigator
    // Ref: https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
    private static rootNavigator: NavigationContainerComponent;

    static switch(routeName: string) {
        Navigation.rootNavigator.dispatch(NavigationActions.navigate({routeName}));
    }

    static rootRouter(): React.ReactNode {
        return <AppContainer ref={(_: NavigationContainerComponent) => (Navigation.rootNavigator = _)} />;
    }
}
