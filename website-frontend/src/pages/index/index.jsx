import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import reducer from "../../reducer/user";
import saga from "../../reducer/saga";
import Header from "../../containers/Header";
import Nav from "../../containers/Nav";
import Welcome from "../../containers/Welcome";
import Login from "../../containers/Login";
import "./index.scss";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(saga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Header/>
                <Nav/>
                <main>
                    <Switch>
                        <Route exact path="/" component={Welcome}/>
                        <Route path="/login" component={Login}/>
                    </Switch>
                </main>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById("app")
);
