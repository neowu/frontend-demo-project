import {startApp} from "core-fe";
import {ErrorHandler} from "./module/ErrorHandler";
import {Main} from "./module/main";

// e.g. use following way to override cdn if needed
// declare var __webpack_public_path__: string;
// __webpack_public_path__ = "//" + window.location.hostname.replace(/^[^.]*/, "static") + "/";

startApp({
    componentType: Main,
    errorListener: new ErrorHandler(),
});
