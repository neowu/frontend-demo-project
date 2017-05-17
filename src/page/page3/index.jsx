import React, {PureComponent} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Link, Route} from "react-router-dom";
import {createStore} from "redux";
import Counter from "../../component/counter/counter";

const reducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        default:
            return state;
    }
};
const store = createStore(reducer);

const Home = () =>
    <div>
        <h2>Home</h2>
    </div>;

const About = () =>
    <div>
        <h2>About</h2>
    </div>;


class CounterContainer extends PureComponent {
    increase() {
        store.dispatch({type: "INCREMENT"});
    }

    decrease() {
        store.dispatch({type: "DECREMENT"});
    }

    render() {
        return <Counter
            value={store.getState()}
            onIncrement={this.increase}
            onDecrement={this.decrease}
        />;
    }

}
const render = () => {
    ReactDOM.render(
        <BrowserRouter basename={"/page3"}>
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/counter">Counter</Link></li>
                </ul>

                <hr/>

                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/counter" component={CounterContainer}/>
            </div>
        </BrowserRouter>
        ,
        document.getElementById("app")
    );
};

render();
store.subscribe(render);
