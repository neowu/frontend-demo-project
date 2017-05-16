import React from "react";
import ReactDOM from "react-dom";
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

const render = () => {
    ReactDOM.render(
        <Counter
            value={store.getState()}
            onIncrement={() => store.dispatch({type: "INCREMENT"})}
            onDecrement={() => store.dispatch({type: "DECREMENT"})}
        />,
        document.getElementById("app")
    );
};

render();
store.subscribe(render);
