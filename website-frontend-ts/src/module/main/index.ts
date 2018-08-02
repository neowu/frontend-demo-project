import {message} from "antd";
import {Listener, register, Handler} from "core-fe";
import Main from "./component/Main";

class ActionHandler extends Handler<{}> implements Listener {
    *onError(error: any) {
        message.error(error.message, 5);
    }
}

register(new ActionHandler("main", null));
export {Main};
