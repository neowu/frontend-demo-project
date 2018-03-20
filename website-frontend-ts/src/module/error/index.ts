import {message} from "antd";
import {Listener, module} from "framework";

class ListenerImpl implements Listener {
    * onError(error: any) {
        message.error(error.message, 5);
    }
}

export default module("error", {}, null, null, new ListenerImpl());
