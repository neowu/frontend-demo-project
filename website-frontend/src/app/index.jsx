import {createApp} from "../framework/application";
import App from "./containers/App";
import userModule from "./modules/user";
import productModule from "./modules/product";
import errorModule from "./modules/error";

const app = createApp();
app.module("error", errorModule);
app.module("user", userModule);
app.module("product", productModule);

app.start(App, "root");
