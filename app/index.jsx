import "./main.scss";
import App from "./component/app";
import React from "react";
import ReactDOM from "react-dom";
import component from "./component";

document.getElementById("app").appendChild(component());

ReactDOM.render(
    <App/>,
    document.getElementById("test")
);
