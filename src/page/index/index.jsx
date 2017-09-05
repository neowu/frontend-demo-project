import React from "react";
import ReactDOM from "react-dom";

import "core-js/fn/promise"; // only import promise
import "./index-part1.scss";
import "./index-part2.scss";
import "lib/3rd-party";
import Lazy from "../../component/Lazy";
import legacy from "../../legacy/test";
import {sayHello, sayHelloPromise} from "../../service/some-service";

legacy();

sayHello("neo");

sayHelloPromise("neo").then(result => `${result}`);

ReactDOM.render(
    <div>
        <Lazy module={import(/* webpackChunkName: "welcome" */ "../../component/welcome/welcome")} name="neo"/>
        <div className="container">
            <div className="row">
                <div className="col-sm-4">
                    <h3>Column 1</h3>
                    <p>{sayHello("neo")}</p>
                </div>
                <div className="col-sm-4">
                    <h3>Column 2</h3>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
                </div>
                <div className="col-sm-4">
                    <h3>Column 3</h3>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
                </div>
            </div>
        </div>
    </div>,
    document.getElementById("app")
);
