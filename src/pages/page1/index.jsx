import "./page1.scss";
import Header from "components/header/header";
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "components/welcome/welcome";

ReactDOM.render(
    <Welcome/>,
    document.getElementById("app")
);

ReactDOM.render(
    <Header title="someTitle"/>,
    document.getElementById("header")
);
