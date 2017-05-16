import React from "react";
import ReactDOM from "react-dom";

import "./index-part1.scss";
import "./index-part2.scss";
import "lib/3rd-party";
import Lazy from "../../component/Lazy";
import loadWelcome from "bundle-loader?lazy&name=[name]!../../component/welcome/welcome";

ReactDOM.render(
    <Lazy load={loadWelcome}>
        {(Welcome) => <Welcome/>}
    </Lazy>,
    document.getElementById("app")
);
