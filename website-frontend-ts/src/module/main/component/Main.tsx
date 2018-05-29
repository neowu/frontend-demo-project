import {Layout} from "antd";
import {asyncComponent} from "framework";
import {LoginForm} from "module/user";
import React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import Header from "./Header";
import "./main.less";
import Nav from "./Nav";
import NotFound from "./NotFound";
import Welcome from "./Welcome";

const Main = () => {
    const AddProduct = asyncComponent(() => import(/* webpackChunkName: "product" */ "module/product").then(module => module.AddProduct));
    const ProductList = asyncComponent(() => import(/* webpackChunkName: "product" */ "module/product").then(module => module.ProductList));

    return (
        <Layout>
            <Nav />
            <Layout>
                <Header />
                <Layout>
                    <Layout.Content className="app-layout">
                        <Switch>
                            <Route exact path="/" component={Welcome} />
                            <Route exact path="/login" component={LoginForm} />
                            <Route exact path="/product/list" component={ProductList} />
                            <Route exact path="/product/add" component={AddProduct} />
                            <Route component={NotFound} />
                        </Switch>
                    </Layout.Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default connect()(Main);
