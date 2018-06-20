import {Spin} from "antd";
import {loadingComponent} from "core-fe";
import React from "react";
import {connect} from "react-redux";
import {LOADING_PRODUCT_LIST} from "../type";

class ProductList extends React.PureComponent {
    render() {
        return (
            <div>
                <h1>product list</h1>
            </div>
        );
    }
}

const LoadingProductList = loadingComponent(LOADING_PRODUCT_LIST, ProductList, Spin);

export default connect()(LoadingProductList);
