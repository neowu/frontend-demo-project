import appConfig from "app/conf/default";
import {ErrorHandler} from "app/module/ErrorHandler";
import {AppComponent} from "app/module/main";
import {NetworkService} from "app/service/NetworkService";
import {startApp} from "core-native";
import {YellowBox} from "react-native";
// import "react-native-gesture-handler";

export function bootstrap() {
    startApp({
        registeredAppName: "demo",
        componentType: AppComponent,
        errorListener: new ErrorHandler(),
        beforeRendering: async () => {
            YellowBox.ignoreWarnings(["Require cycle", "Async Storage"]);
            await NetworkService.init(appConfig.apiURL);
        },
    });
}
