import {ConfigService} from "app/service/ConfigService";
import {ThirdPartyLauncher} from "app/service/ThirdPartyLauncher";
import {Vibration} from "react-native";

interface Setting {
    allowSound: boolean;
    allowVibration: boolean;
    customerServiceURL: string | null;
}

type SoundEffect = "a" | "b";

export class SettingService {
    private static readonly config: ConfigService<Setting> = new ConfigService("setting", {
        allowSound: true,
        allowVibration: true,
        customerServiceURL: null,
    });

    static async init() {
        await SettingService.config.load();
    }

    static vibrate() {
        if (SettingService.config.get("allowVibration")) {
            Vibration.vibrate(150, false);
        }
    }

    static playSound(type: SoundEffect) {
        if (SettingService.config.get("allowSound")) {
            // Add in 2nd phase
            // https://github.com/johnsonsu/react-native-sound-player
        }
    }

    static openCustomerService() {
        ThirdPartyLauncher.open(SettingService.config.get("customerServiceURL"));
    }

    static isVibrationOn() {
        return SettingService.config.get("allowVibration");
    }

    static isSoundOn() {
        return SettingService.config.get("allowSound");
    }

    static async updateConfig<T extends keyof Setting>(key: T, value: NonNullable<Setting[T]>) {
        await SettingService.config.update(key, value);
    }
}
