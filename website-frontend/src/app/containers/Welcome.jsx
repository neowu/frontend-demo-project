import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button} from "antd";

const Welcome = ({dispatch}) => <div>
    <h1>Welcome</h1>
    <Button onClick={() => {
        dispatch({
            type: "ERROR",
            message: "test",
            detail: "trace"
        });
    }}>Test</Button>
</div>;

Welcome.propTypes = {
    dispatch: PropTypes.func
};

export default connect()(Welcome);
