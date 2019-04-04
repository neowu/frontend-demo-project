import {Module, register} from "core-fe";
import MainComponent from "./component/Main";

class MainModule extends Module<{}> {}

const module = register(new MainModule("main", {}));
export const Main = module.attachLifecycle(MainComponent);
