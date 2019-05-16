import appConfig from "app/conf/default";
import {ErrorHandler} from "app/module/ErrorHandler";
import {AppComponent} from "app/module/main";
import {NetworkService} from "app/service/NetworkService";
import {SettingService} from "app/service/SettingService";
import {startApp} from "core-native";
import {YellowBox} from "react-native";
import {Navigation} from "./module/Navigation";

// load navigation before start
Navigation.rootRouter();

export function bootstrap() {
    startApp({
        registeredAppName: "demo",
        componentType: AppComponent,
        errorListener: new ErrorHandler(),
        logger: {
            sendingFrequency: 10,
            serverURL: appConfig.logServer,
            maskedKeywords: [/password/i],
        },
        beforeRendering: async () => {
            YellowBox.ignoreWarnings(["Require cycle", "Async Storage"]);
            await NetworkService.init();
            await SettingService.init();
        },
    });
}
