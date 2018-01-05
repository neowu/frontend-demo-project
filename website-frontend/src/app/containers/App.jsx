import React from "react";
import PropTypes from "prop-types";
import {Redirect, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Header from "./Header";
import Nav from "./Nav";
import {Layout} from "antd";
import css from "./app.less";
import ErrorMessage from "../../framework/components/ErrorMessage";
import ProductList from "./product/ProductList";
import Lazy from "../../framework/components/Lazy";
import LoginForm from "./LoginForm";
import withLoading from "../../framework/components/loading";
import AddProduct from "./product/AddProduct";

class App extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({type: "CHECK_CURRENT_USER"});
    }

    render() {
        const Welcome = () => <Lazy module={import(/* webpackChunkName: "welcome" */"./Welcome")}/>;

        return <Layout>
            <Nav/>
            <Layout>
                <ErrorMessage/>
                <Header/>
                <Layout>
                    <Layout.Content className={css.layout}>
                        <Switch>
                            <Route exact path="/" component={Welcome}/>
                            <Route exact path="/login" component={LoginForm}/>
                            <Route exact path="/product/list" component={withLoading("PRODUCT/LIST", <ProductList/>)}/>
                            <Route exact path="/product/add" component={withLoading("PRODUCT/LOAD_CREATE_CONFIG", <AddProduct/>)}/>
                            <Redirect to="/404"/>
                        </Switch>
                    </Layout.Content>
                </Layout>
            </Layout>
        </Layout>;
    }
}

App.propTypes = {
    dispatch: PropTypes.func
};

export default connect()(App);
