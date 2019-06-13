import {RootState} from "app/type/state";
import {showLoading} from "core-native";
import {Content, Spinner, Text} from "native-base";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import {LOADING_PRODUCT_LIST} from "../type";

interface StateProps {
    showLoading: boolean;
}

interface Props extends StateProps, DispatchProp {}

class Component extends React.PureComponent<Props> {
    render() {
        return this.props.showLoading ? (
            <Spinner />
        ) : (
            <Content>
                <Text>product list</Text>
            </Content>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    return {
        showLoading: showLoading(state, LOADING_PRODUCT_LIST),
    };
};

export default connect(mapStateToProps)(Component);
