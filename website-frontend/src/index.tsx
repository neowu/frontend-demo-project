import {async, bootstrap} from "core-fe";
import {ErrorHandler} from "./module/ErrorHandler";

// use async to load first component, so any error during component construction will be caught and reported by framework
const Home = async(() => import(/* webpackChunkName: "home" */ "module/home"), "Home");

// e.g. use following way to override cdn if needed
// declare var __webpack_public_path__: string;
// __webpack_public_path__ = "//" + window.location.hostname.replace(/^[^.]*/, "static") + "/";
// but since the path in index.html can't be changed,
// so usually it's better handle in backend to dynamically replace static cdn domain when response index.html content

bootstrap({
    componentType: Home,
    errorListener: new ErrorHandler(),
});
