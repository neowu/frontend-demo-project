import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Spin} from "antd";

const ProductList = ({loading}) => {
    if (loading) {
        return <Spin/>;
    }
    return <div>
        <h1>product list</h1>
    </div>;
};

ProductList.propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool
};

export default connect(state => ({
    loading: state.loading["PRODUCT/LIST"]
}))(ProductList);
