import {Module, register} from "core-fe";
import MainComponent from "./component/Home";

class HomeModule extends Module<{}> {}

const module = register(new HomeModule("home", {}));
export const Home = module.attachLifecycle(MainComponent);
