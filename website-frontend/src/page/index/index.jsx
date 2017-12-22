import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Header from "../../component/header/Header";

ReactDOM.render(
    <div>
        <div className="container">
            <Header/>
        </div>
    </div>,
    document.getElementById("app")
);
