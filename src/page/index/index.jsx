import "./index-part1.scss";
import "./index-part2.scss";
import "lib/3rd-party";
import React from "react";
import ReactDOM from "react-dom";
import loadWelcome from "bundle-loader?lazy&name=[name]!../../component/welcome/welcome";
import Lazy from "../../component/Lazy";

const Welcome = () =>
    <Lazy load={loadWelcome}>
        {(Component) => {
            if (!Component) {
                return <div>loading</div>;
            }
            return <Component/>;
        }}
    </Lazy>;

ReactDOM.render(
    <Welcome/>,
    document.getElementById("app")
);
