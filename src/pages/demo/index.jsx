import Header from "components/header/header";
import Layout from "modules/lobby/loayout";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <Header title="someTitle"/>,
    document.getElementById("header")
);

ReactDOM.render(
    <Layout/>,
    document.getElementById("app")
);
