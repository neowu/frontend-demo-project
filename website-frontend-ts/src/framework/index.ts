import {RouterState} from "connected-react-router";
import {LoadingState} from "./loading";

export {Listener, LocationChangedEvent} from "./listener";
export {render} from "./app";
export {module, effect} from "./module";
export {actionCreator} from "./action";
export {asyncComponent} from "./component/asyncComponent";
export {loadingComponent} from "./component/loadingComponent";

export interface FrameworkState extends RouterState, LoadingState {
    app: {};
}
