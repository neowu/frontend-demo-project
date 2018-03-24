import {message} from "antd";
import {Listener, register} from "framework";

class ListenerImpl implements Listener {
    * onError(error: any) {
        message.error(error.message, 5);
    }
}

register("error", null, null, new ListenerImpl());
