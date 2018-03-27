import React from "react";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {asyncComponent} from "framework";
import {Layout} from "antd";
import Header from "./Header";
import Nav from "./Nav";
import NotFound from "./NotFound";
import Welcome from "./Welcome";
import "./main.less";

import {LoginForm} from "module/user";

const Main = () => {
    const AddProduct = asyncComponent(() => import(/* webpackChunkName: "product" */"module/product").then(module => module.AddProduct));
    const ProductList = asyncComponent(() => import(/* webpackChunkName: "product" */"module/product").then(module => module.ProductList));

    return <Layout>
        <Nav/>
        <Layout>
            <Header/>
            <Layout>
                <Layout.Content className="app-layout">
                    <Switch>
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/login" component={LoginForm}/>
                        <Route exact path="/product/list" component={ProductList}/>
                        <Route exact path="/product/add" component={AddProduct}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Layout.Content>
            </Layout>
        </Layout>
    </Layout>;
};

export default connect()(Main);
