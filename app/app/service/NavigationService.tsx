import {HomeComponent} from "app/module/common/home";
import {LoginComponent, Demo} from "app/module/main";
import React from "react";
import {createAppContainer, createBottomTabNavigator, createSwitchNavigator, NavigationActions, NavigationContainerComponent, NavigationRouteConfig, BottomTabNavigatorConfig, createStackNavigator} from "react-navigation";
import {Throttle} from "app/util/decorator/regular";
import {Icon, IconClass, Text} from "app/component/library";

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
                    // TODO: replace icon
                    const tabsIcons: Record<TabsScreen, IconClass> = {
                        Home: IconClass.TOPUP_RECORD,
                        Report: IconClass.REPORT_FORM,
                        Team: IconClass.TEAM_MANAGEMENT,
                        Account: IconClass.USER,
                    };
                    return <Icon size="title" type={tabsIcons[navigation.state.routeName]} style={{color: focused ? tintColor! : undefined}} />;
                },
                tabBarLabel: ({focused, tintColor}) => {
                    const tabsIcons: Record<TabsScreen, string> = {
                        Home: "主页",
                        Report: "报表",
                        Team: "团队",
                        Account: "我的",
                    };
                    return (
                        <Text style={{color: focused ? tintColor! : undefined}} size="small">
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
                Demo,
                Login: LoginComponent,
                Core: CoreStack,
            })
        );
        // return <AppContainer persistenceKey={__DEV__ ? "app.dev.route" : null} ref={(_: any) => (NavigationService.rootNavigator = _)} />;
        return <AppContainer ref={(_: any) => (NavigationService.rootNavigator = _)} />;
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
