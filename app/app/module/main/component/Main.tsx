import {Navigation} from "app/module/Navigation";
import {RootState} from "app/type/state";
import {showLoading} from "core-native";
import React from "react";
import {connect, DispatchProp} from "react-redux";

interface StateProps {
    showGlobalLoading: boolean;
}

interface Props extends StateProps, DispatchProp {}

class AppMain extends React.PureComponent<Props> {
    render() {
        return Navigation.rootRouter();
    }
}

const mapStateToProps = (state: RootState): StateProps => {
    const {currentUser} = state.app.main;
    return {
        showGlobalLoading: showLoading(state),
    };
};

export default connect(mapStateToProps)(AppMain);
