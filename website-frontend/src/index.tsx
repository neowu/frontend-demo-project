import {startApp} from "core-fe";
import {ErrorHandler} from "./module/ErrorHandler";
import {Main} from "./module/main";

startApp({
    componentType: Main,
    errorListener: new ErrorHandler(),
});
