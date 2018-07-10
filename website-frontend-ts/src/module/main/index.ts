import {message} from "antd";
import {Listener, register} from "core-fe";
import Main from "./component/Main";

class ListenerImpl implements Listener {
    * onError(error: any) {
        message.error(error.message, 5);
    }
}

const namespace = "main";
const listener = new ListenerImpl();
register({namespace, listener});
export {Main};
