import React, {PureComponent} from "react";
import {render} from "react-dom";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";
import Counter from "../../component/counter/counter";
import TodoContainer from "./container/todo-container";

const todo = (state, action) => {
    switch (action.type) {
        case "ADD_TODO":
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case "TOGGLE_TODO":
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const initialState = {
    counter: 0,
    todos: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "INCREMENT":
            return {
                ...state,
                counter: state.counter + 1
            };
        case "DECREMENT":
            return {
                ...state,
                counter: state.counter - 1
            };
        case "ADD_TODO":
            return {
                ...state,
                todos: [...state.todos, todo(null, action)]
            };
        case "TOGGLE_TODO":
            return {
                ...state,
                todos: state.todos.map(item => todo(item, action))
            };
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
        return <Counter value={store.getState().counter}
                        onIncrement={this.increase}
                        onDecrement={this.decrease}/>;
    }

}

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
