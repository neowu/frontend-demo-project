import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Alert} from "antd";

const ErrorMessage = ({dispatch, message, detail}) => {
    const onClose = () => dispatch({
        type: "ERROR",
        message: null,
        detail: null
    });

    if (!message) return null;
    return <Alert message={message} description={detail} type="error" closable onClose={onClose}/>;
};

ErrorMessage.propTypes = {
    dispatch: PropTypes.func,
    message: PropTypes.string,
    detail: PropTypes.string
};

export default connect(state => ({
    message: state.error.message,
    detail: state.error.detail
}))(ErrorMessage);
