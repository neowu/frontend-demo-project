import {RootState} from "app/type/state";
import {createRegularDecorator} from "core-native";

export function LoginRequired() {
    return createRegularDecorator((handler, currentRootState: RootState) => {
        const currentUser = currentRootState.app.main.currentUser;
        if (currentUser) {
            handler();
        } else {
            // TODO
            // NavigationService.openLoginStack();
        }
    });
}

export function Throttle(millisecond: number) {
    let hasCalled = false;
    return createRegularDecorator(handler => {
        if (!hasCalled) {
            handler();
            hasCalled = true;
            setTimeout(() => {
                hasCalled = false;
            }, millisecond);
        }
    });
}
