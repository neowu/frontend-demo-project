import App from "./container/App";
import {render} from "framework_v2/app";

import "module_v2/error";

// import {Application} from "./framework/application";
// import userModule from "./module/user";
// import productModule from "./module/product";
// import errorModule from "./module/error";
//
// const application = new Application();
// application.module("error", errorModule);
// application.module("user", userModule);
// application.module("product", productModule);
//
// application.start(App, "root");

render(App, "root");
