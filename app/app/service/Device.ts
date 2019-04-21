import {Memo} from "core-native";
import {Platform} from "react-native";
import DeviceInfo from "react-native-device-info";

export class Device {
    @Memo()
    static id() {
        return DeviceInfo.getUniqueID();
    }

    @Memo()
    static os() {
        return Platform.OS + " " + DeviceInfo.getSystemVersion();
    }
}
