import React from "react";
import PropTypes from "prop-types";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Header from "./Header";
import Nav from "./Nav";
import Welcome from "./Welcome";
import Login from "./Login";
import {Layout} from "antd";
import css from "./app.less";
import ErrorMessage from "../../framework/components/ErrorMessage";
import ProductList from "./product/ProductList";

class App extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({type: "CHECK_CURRENT_USER"});
    }

    render() {
        return <BrowserRouter>
            <Layout>
                <Nav/>
                <Layout>
                    <ErrorMessage/>
                    <Header/>
                    <Layout>
                        <Layout.Content className={css.layout}>
                            <Switch>
                                <Route exact path="/" component={Welcome}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/product" component={ProductList}/>
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
    dispatch: PropTypes.func
};

export default connect()(App);
