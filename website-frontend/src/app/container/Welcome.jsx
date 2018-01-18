import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button} from "antd";

const Welcome = () => {
    const abc = 2;
    if (abc === 1) throw new Error("react render error test");
    return <div>
        <h1>Welcome</h1>
        <Button onClick={() => {
            throw new Error("test error in button");
        }}>Test</Button>
    </div>;
};

Welcome.propTypes = {
    dispatch: PropTypes.func
};

export default connect()(Welcome);
