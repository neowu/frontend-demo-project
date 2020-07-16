import {Module, register} from "core-fe";
import MainComponent from "./component/Home";
import {RootState} from "type/state";

class HomeModule extends Module<RootState, "home"> {}

const module = register(new HomeModule("home", {}));
export const Home = module.attachLifecycle(MainComponent);
