import {create} from "../../framework/application";
import App from "../containers/App";
import userModule from "../modules/user";
import productModule from "../modules/product";

const app = create();
app.module("user", userModule);
app.module("product", productModule);

app.start(App, "root");
