import Account from "modules/account/layout";
import Lobby from "modules/lobby/layout";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <Account/>,
    document.getElementById("header")
);

ReactDOM.render(
    <Lobby/>,
    document.getElementById("app")
);
