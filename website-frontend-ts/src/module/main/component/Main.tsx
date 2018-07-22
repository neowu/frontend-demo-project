import {Layout} from "antd";
import {async} from "core-fe";
import {LoginForm} from "module/user";
import React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import Header from "./Header";
import "./main.less";
import Nav from "./Nav";
import NotFound from "./NotFound";
import Welcome from "./Welcome";

// // type ReactComponentKeyOf<T> = {[P in keyof T]: T[P] extends React.ComponentType<any> ? P : never}[keyof T];
//
// function async<T>(module: string, component: string, loadingComponent: React.ReactNode = null): React.ComponentType<any> {
//     // const m = module;
//     // const promise = Promise.resolve(resolve => import(/* webpackMode: "lazy-once", webpackChunkName: "[request]" */ `${m}`).then(module => resolve(module)));
//     interface State {
//         Component: React.ComponentType<any> | null;
//     }
//
//     class Component extends React.PureComponent<{}, State> {
//         state: State = {
//             Component: null,
//         };
//
//         componentDidMount() {
//             const resolve = () => import(/* webpackMode: "lazy", webpackChunkName: "[request]" */ `module/${module}`);
//             resolve().then(module => {
//                 const Component = module[component] as any;
//                 this.setState({Component});
//             });
//         }
//
//         render() {
//             const {Component} = this.state;
//             return Component ? <Component /> : loadingComponent;
//         }
//     }
//
//     return Component;
// }

const Main = () => {
    const AddProduct = async(() => import(/* webpackChunkName: "product" */ "module/product"), "AddProduct");
    const ProductList = async(() => import(/* webpackChunkName: "product" */ "module/product"), "ProductList");

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
