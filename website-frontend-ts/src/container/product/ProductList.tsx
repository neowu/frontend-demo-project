import React from "react";
import {connect} from "react-redux";

class ProductList extends React.PureComponent {
    render() {
        return <div>
            <h1>product list</h1>
        </div>;
    }
}

export default connect()(ProductList);
