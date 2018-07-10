import {Spin} from "antd";
import {Loading} from "core-fe";
import React from "react";
import {connect} from "react-redux";
import {LOADING_PRODUCT_LIST} from "../type";

class Component extends React.PureComponent {
    render() {
        return (
            <Loading
                loading={LOADING_PRODUCT_LIST}
                render={props => (
                    <Spin size={"large"} spinning={props.show}>
                        <div>
                            <h1>product list</h1>
                        </div>
                    </Spin>
                )}
            />
        );
    }
}

export default connect()(Component);
