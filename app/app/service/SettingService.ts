import {Vibration} from "react-native";

interface Setting {
    allowSound: boolean;
    allowVibration: boolean;
    customerServiceURL: string | null;
}

type SoundEffect = "a" | "b";

export class SettingService {
    private static readonly config = {
        allowSound: true,
        allowVibration: true,
        customerServiceURL: null,
    };

    static async init() {}

    static vibrate() {
        Vibration.vibrate(150, false);
    }

    static playSound(type: SoundEffect) {}

    static openCustomerService() {
        return;
    }

    static isVibrationOn() {
        return false;
    }

    static isSoundOn() {
        return false;
    }

    static async updateConfig<T extends keyof Setting>(key: T, value: NonNullable<Setting[T]>) {
        return;
    }
}
