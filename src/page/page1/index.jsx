import React from "react";
import ReactDOM from "react-dom";

import "./page1.scss";
import Header from "../../component/header/header";
import Welcome from "../../component/welcome/welcome";

ReactDOM.render(
    <Welcome/>,
    document.getElementById("app")
);

ReactDOM.render(
    <Header title="someTitle"/>,
    document.getElementById("header")
);
