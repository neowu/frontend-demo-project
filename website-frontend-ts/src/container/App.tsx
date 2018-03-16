import React from "react";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Header from "./Header";
import Nav from "./Nav";
import {Layout} from "antd";
import ProductList from "./product/ProductList";
import Lazy from "framework/component/Lazy";
import withLoading from "framework/component/loading";
import NotFound from "./NotFound";
import userModule from "module_v2/user";
import productModule from "module_v2/product";
import "./app.less";

import "module_v2/user";

const App = () => {
    const Welcome = () => <Lazy module={import(/* webpackChunkName: "welcome" */"./Welcome")}/>;

    return <Layout>
        <Nav/>
        <Layout>
            <Header/>
            <Layout>
                <Layout.Content className="app-layout">
                    <Switch>
                        <Route exact path="/" component={Welcome}/>
                        <Route exact path="/login" component={userModule.LoginForm}/>
                        <Route exact path="/product/list" component={withLoading("PRODUCT/LIST", <ProductList/>)}/>
                        <Route exact path="/product/add" component={productModule.AddProduct}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Layout.Content>
            </Layout>
        </Layout>
    </Layout>;
};

export default connect()(App);
