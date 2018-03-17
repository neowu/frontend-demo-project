import React from "react";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Header from "./Header";
import Nav from "./Nav";
import {Layout} from "antd";
import ProductList from "module/product/component/ProductList";
import Lazy from "framework/component/Lazy";
import NotFound from "./NotFound";
import "./app.less";

import userModule from "module/user";
import {asyncComponent} from "framework_v2";

const App = () => {
    const Welcome = () => <Lazy module={import(/* webpackChunkName: "welcome" */"./Welcome")}/>;
    const AddProduct = asyncComponent(() => import(/* webpackChunkName: "product" */"module/product"), "AddProduct");

    return <Layout>
        <Nav/>
        <Layout>
            <Header/>
            <Layout>
                <Layout.Content className="app-layout">
                    <Switch>
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/login" component={userModule.LoginForm}/>
                        <Route exact path="/product/list" component={ProductList}/>
                        <Route exact path="/product/add" component={AddProduct}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Layout.Content>
            </Layout>
        </Layout>
    </Layout>;
};

export default connect()(App);
