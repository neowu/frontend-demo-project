import {State as LoginState} from "app/module/login/type";
import {State as MainState} from "app/module/main/type";
import {State} from "core-native";

export interface RootState extends State {
    app: {
        main: MainState;
        login: LoginState;
    };
}
