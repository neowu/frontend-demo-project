import React from "react";
import {connect} from "react-redux";
import {Button} from "antd";

const Welcome = () => {
    // const abc = 2;
    // if (abc === 1) {
    //     throw new Error("react render error test");
    // }
    const onClick = () => {
        throw new Error("test error in button");
    };

    return <div>
        <h1>Welcome</h1>
        <Button onClick={onClick}>
            Test
        </Button>
    </div>;
};

export default connect()(Welcome);
