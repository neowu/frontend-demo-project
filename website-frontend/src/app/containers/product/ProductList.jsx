import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Spin} from "antd";

class ProductList extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({type: "PRODUCT/LIST"});
    }

    render() {
        if (this.props.loading) {
            return <Spin/>;
        }
        return <div>
            <h1>product list</h1>
        </div>;
    }
}

ProductList.propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool
};

export default connect(state => ({
    loading: state.loading["PRODUCT/LIST"]
}))(ProductList);
