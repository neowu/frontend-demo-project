import {LoginComponent} from "app/module/login";
import {AccountAJAXWebService} from "app/service/api/AccountAJAXWebService";
import {LoginAJAXRequest} from "app/type/api";
import {call, Lifecycle, Loading, Log, Module, register} from "core-native";
import SplashScreen from "react-native-splash-screen";
import {SagaIterator} from "redux-saga";
import AppMain from "./component/Main";
import {CurrentUser, State} from "./type";

const initialState: State = {
    currentUser: {
        loggedIn: false,
        name: null,
        role: null,
    },
};

class AppModule extends Module<State> {
    @Lifecycle()
    *onEnter(): SagaIterator {
        try {
            // Register logger context
            // this.logger.setContext({
            //     userId: () => (this.state.currentUser ? this.state.currentUser.name : "-"),
            //     deviceId: () => Device.id(),
            //     routing: () => NavigationService.getRouteInfo(),
            //     apiServer: () => NetworkService.getOrigin(),
            // });

            // Call initial API
            yield* this.fetchCurrentUser();
        } finally {
            SplashScreen.hide();
        }
    }

    @Log()
    @Loading()
    *login(request: LoginAJAXRequest): SagaIterator {
        const effect = call(AccountAJAXWebService.login, request);
        yield effect;
        const response = effect.result();
        if (response.success) {
            yield* this.populateCurrentUser({name: response.name, loggedIn: true, role: response.role});
        } else {
            // TODO
        }
    }

    @Log()
    *logout(): SagaIterator {
        yield call(AccountAJAXWebService.logout);
        yield* this.populateCurrentUser({loggedIn: false});
    }

    *populateCurrentUser(currentUser: CurrentUser): SagaIterator {
        this.setState({currentUser});
        // NavigationService.switch(currentUser ? "Core" : "Login");
    }

    private *fetchCurrentUser(): SagaIterator {
        const effect = call(AccountAJAXWebService.currentUser);
        yield effect;
        const response = effect.result();
        yield* this.populateCurrentUser({name: response.name, loggedIn: response.loggedIn, role: response.role});
    }
}

const module = register(new AppModule("main", initialState));
export const actions = module.getActions();
export const AppComponent = module.attachLifecycle(AppMain);
export {LoginComponent};
