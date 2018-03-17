import {message} from "antd";
import {Listener} from "framework_v2/type";
import {module} from "framework_v2/module";

class ActionHandler implements Listener {
    * _onError(error: any) {
        message.error(error.message, 5);
    }
}

export default module("error", {}, new ActionHandler(), {});
