import {Spin} from "antd";
import {showLoading} from "core-fe";
import React from "react";
import {connect} from "react-redux";
import {RootState} from "type/state";
import {LOADING_PRODUCT_LIST} from "../type";

interface StateProps {
    showLoading: boolean;
}

interface Props extends StateProps {}

class Component extends React.PureComponent<Props> {
    override render() {
        return (
            <Spin size="large" spinning={this.props.showLoading}>
                <div>
                    <h1>product list</h1>
                </div>
            </Spin>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        showLoading: showLoading(state, LOADING_PRODUCT_LIST),
    };
};

export default connect(mapStateToProps)(Component);
