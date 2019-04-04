import {startApp} from "core-fe";
import {ErrorHandlerModule} from "./module/ErrorHandlerModule";
import {Main} from "./module/main";

startApp({
    componentType: Main,
    errorHandlerModule: ErrorHandlerModule,
});
