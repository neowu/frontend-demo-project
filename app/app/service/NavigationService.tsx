import {HomeComponent} from "app/module/common/home";
import {LoginComponent} from "app/module/main";
import {Throttle} from "app/util/decorator/regular";
import {Accordion, Text} from "native-base";
import React from "react";
import {BottomTabNavigatorConfig, createAppContainer, createBottomTabNavigator, createStackNavigator, createSwitchNavigator, NavigationActions, NavigationContainerComponent, NavigationRouteConfig} from "react-navigation";

type Switch = "Login" | "Core" | "Demo"; // TODO: remove Demo
type TabsScreen = "Home" | "Report" | "Team" | "Account";
type CoreStackScreen = "Tabs";

export class NavigationService {
    // Registered root-level navigator
    // Ref: https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
    private static rootNavigator: NavigationContainerComponent;

    static rootRouter(): React.ReactNode {
        // TODO
        const tabsNavigator: Record<TabsScreen, NavigationRouteConfig> = {
            Home: HomeComponent,
            Report: HomeComponent,
            Team: HomeComponent,
            Account: HomeComponent,
        };
        const tabsNavigatorConfig: BottomTabNavigatorConfig = {
            defaultNavigationOptions: ({navigation}) => ({
                tabBarIcon: ({focused, tintColor}) => {
                    return <Accordion dataArray={[""]} icon="add" expandedIcon="remove"/>;
                },
                tabBarLabel: ({focused, tintColor}) => {
                    const tabsIcons: Record<TabsScreen, string> = {
                        Home: "主页",
                        Report: "报表",
                        Team: "团队",
                        Account: "我的",
                    };
                    return (
                        <Text>
                            {tabsIcons[navigation.state.routeName]}
                        </Text>
                    );
                },
            }),
            tabBarOptions: {
                activeTintColor: "tomato",
                inactiveTintColor: "blue",
            },
        };
        const Tabs = createBottomTabNavigator(tabsNavigator, tabsNavigatorConfig);
        const coreNavigator: Record<CoreStackScreen, NavigationRouteConfig> = {
            Tabs,
            // TODO: other stack screen...
        };
        const CoreStack = createStackNavigator(coreNavigator, {headerMode: "none"});
        const AppContainer = createAppContainer(
            createSwitchNavigator({
                Login: LoginComponent,
                Core: CoreStack,
            })
        );
        // return <AppContainer persistenceKey={__DEV__ ? "app.dev.route" : null} ref={(_: any) => (NavigationService.rootNavigator = _)} />;
        return <AppContainer ref={(_: any) => (NavigationService.rootNavigator = _)}/>;
    }

    static getRouteInfo() {
        // TODO
        return "";
    }

    static switch(routeName: Switch) {
        NavigationService.rootNavigator.dispatch(NavigationActions.navigate({routeName}));
    }

    @Throttle(500)
    static goBack() {
        NavigationService.rootNavigator.dispatch(NavigationActions.back());
    }
}
