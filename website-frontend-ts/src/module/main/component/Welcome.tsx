import {Button} from "antd";
import React from "react";
import {connect} from "react-redux";

const ui = require("conf/ui.json");

const Welcome = () => {
    // const abc = 2;
    // if (abc === 1) {
    //     throw new Error("react render error test");
    // }
    const onClick = () => {
        throw new Error("test error in button");
    };

    return <div>
        <h1>Welcome, {ui.title}</h1>
        <Button onClick={onClick}>
            Test
        </Button>
    </div>;
};

export default connect()(Welcome);
