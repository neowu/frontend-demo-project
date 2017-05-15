import "./index-part1.scss";
import "./index-part2.scss";
import "lib/3rd-party";
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "components/welcome/welcome";

ReactDOM.render(
    <Welcome/>,
    document.getElementById("app")
);
