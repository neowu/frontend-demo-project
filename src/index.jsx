import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./component/Welcome/Welcome";
import api from "conf/api.json";

console.log(api.some_service_url);

ReactDOM.render(
    <Welcome/>,
    document.getElementById("app")
);
