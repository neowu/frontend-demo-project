import {RouterState} from "connected-react-router";
import {LoadingState} from "./loading";

export interface State {
    router: RouterState;
    loading: LoadingState;
    app: {};
}
