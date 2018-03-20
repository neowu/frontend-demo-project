import {message} from "antd";
import {Listener} from "framework/type";
import {module} from "framework/module";

class ListenerImpl implements Listener {
    * onError(error: any) {
        message.error(error.message, 5);
    }
}

export default module("error", {}, null, null, new ListenerImpl());
