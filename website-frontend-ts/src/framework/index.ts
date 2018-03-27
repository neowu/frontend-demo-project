import {RouterState} from "connected-react-router";
import {LoadingState} from "./loading";

export {render} from "./app";
export {actionCreator} from "./action";
export {effect, loading, global} from "./handler";
export {Listener, LocationChangedEvent} from "./listener";
export {register} from "./module";
export {asyncComponent} from "./component/asyncComponent";
export {loadingComponent} from "./component/loadingComponent";

export interface FrameworkState extends RouterState, LoadingState {
    app: {};
}
