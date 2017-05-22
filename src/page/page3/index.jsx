import React from "react";
import {render} from "react-dom";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";

import "./page3.scss";

import Lazy from "../../component/Lazy";
import CounterContainer from "./container/counter-container";

import reducer from "./reducer/reducer";

const store = createStore(reducer);

const Home = () =>
    <div>
        <h2>Home</h2>
    </div>;

const About = () =>
    <div>
        <h2>About</h2>
    </div>;

const TodoContainer = () =>
    <Lazy module={import("./container/todo-container")}/>;

render(
    <Provider store={store}>
        <BrowserRouter basename={"/page3"}>
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/counter">Counter</Link></li>
                    <li><Link to="/todo">Todo</Link></li>
                </ul>

                <hr/>

                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Route path="/counter" component={CounterContainer}/>
                    <Route path="/todo" component={TodoContainer}/>
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById("app")
);
