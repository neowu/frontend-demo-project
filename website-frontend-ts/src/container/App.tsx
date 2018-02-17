import React from "react";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Header from "./Header";
import Nav from "./Nav";
import {Layout} from "antd";
import ProductList from "./product/ProductList";
import Lazy from "../framework/component/Lazy";
import LoginForm from "./LoginForm";
import withLoading from "../framework/component/loading";
import AddProduct from "./product/AddProduct";
import NotFound from "./NotFound";

const css = require("./app.less");

const App = () => {
    const Welcome = () => <Lazy module={import(/* webpackChunkName: "welcome" */"./Welcome")}/>;

    return <Layout>
        <Nav/>
        <Layout>
            <Header/>
            <Layout>
                <Layout.Content className={css.layout}>
                    <Switch>
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/login" component={LoginForm}/>
                        <Route exact path="/product/list" component={withLoading("PRODUCT/LIST", <ProductList/>)}/>
                        <Route exact path="/product/add" component={withLoading("PRODUCT/LOAD_CREATE_CONFIG", <AddProduct/>)}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Layout.Content>
            </Layout>
        </Layout>
    </Layout>;
};

export default connect()(App);
