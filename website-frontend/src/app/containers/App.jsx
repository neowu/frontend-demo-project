import React from "react";
import PropTypes from "prop-types";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import HeaderContainer from "./Header";
import Nav from "./Nav";
import Welcome from "./Welcome";
import Login from "./Login";
import {Layout} from "antd";
import "./app.less";

class App extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({type: "CHECK_CURRENT_USER"});
    }

    componentDidCatch(error, info) { // TODO: move this to general Error Component?
        this.props.dispatch({
            type: "ERROR",
            error: error + ", " + info
        });
    }

    render() {
        if (this.props.hasError) {
            return <div>something goes wrong, {this.props.error}</div>;
        }

        return <BrowserRouter>
            <Layout>
                <HeaderContainer/>
                <Layout>
                    <Nav/>
                    <Layout style={{padding: "0 24px 24px"}}>
                        <Layout.Content style={{
                            background: "#fff",
                            padding: 24,
                            margin: 0,
                            minHeight: 280
                        }}>
                            <Switch>
                                <Route exact path="/" component={Welcome}/>
                                <Route path="/login" component={Login}/>
                                <Redirect to="/404"/>
                            </Switch>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </Layout>
        </BrowserRouter>;
    }
}

App.propTypes = {
    dispatch: PropTypes.func,
    hasError: PropTypes.bool,
    error: PropTypes.string
};

export default connect(state => ({
    hasError: state.error.hasError,
    error: state.error.error
}))(App);
