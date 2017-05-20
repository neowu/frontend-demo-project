import React from "react";
import ReactDOM from "react-dom";

import css from "./page1.scss";
import Header from "../../component/header/header";
import Welcome from "../../component/welcome/welcome";

ReactDOM.render(
    <div>
        <Welcome/>
        <img id={css.tree}/>
        <img id={css.flower}/>
    </div>,
    document.getElementById("app")
);

ReactDOM.render(
    <Header title="someTitle"/>,
    document.getElementById("header")
);
