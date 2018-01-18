import {createApp} from "../framework/application";
import App from "./container/App";
import userModule from "./module/user";
import productModule from "./module/product";
import errorModule from "./module/error";

const app = createApp();
app.module("error", errorModule);
app.module("user", userModule);
app.module("product", productModule);

app.start(App, "root");
