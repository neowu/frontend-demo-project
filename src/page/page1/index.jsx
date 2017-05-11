import Header from "../../component/header/header";
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "../../component/welcome/welcome";

ReactDOM.render(
    <Welcome/>,
    document.getElementById("app")
);

ReactDOM.render(
    <Header title="someTitle"/>,
    document.getElementById("header")
);
