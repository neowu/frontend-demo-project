import "./index-part1.scss";
import "./index-part2.scss";
import "lib/3rd-party";
import React from "react";
import ReactDOM from "react-dom";
import loadWelcome from "bundle-loader?lazy&name=[name]!../../component/welcome/welcome";
import Lazy from "../../component/Lazy";

ReactDOM.render(
    <Lazy load={loadWelcome}>
        {(Welcome) => <Welcome/> }
    </Lazy>,
    document.getElementById("app")
);
