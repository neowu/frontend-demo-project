import {Throttle} from "app/util/decorator/regular";
import React from "react";
import {NavigationActions, NavigationContainerComponent} from "react-navigation";

type Switch = "Login" | "Home";

export class NavigationService {
    // Registered root-level navigator
    // Ref: https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
    static rootNavigator: NavigationContainerComponent;

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
