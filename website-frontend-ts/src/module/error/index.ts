import {message} from "antd";
import {Listener, register} from "core-fe";

class ListenerImpl implements Listener {
    *onError(error: any) {
        message.error(error.message, 5);
    }
}

const namespace = "error";
const listener = new ListenerImpl();
register({namespace, listener});
