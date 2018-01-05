import {createApp} from "../framework/application";
import App from "./containers/App";
import userModule from "./modules/user";
import productModule from "./modules/product";

const app = createApp();
app.module("user", userModule);
app.module("product", productModule);

app.start(App, "root");
