import {create} from "../../framework/application";
import App from "../containers/App";
import userModule from "../modules/user";

const app = create();
app.module("user", userModule);

app.start(App, "app");
