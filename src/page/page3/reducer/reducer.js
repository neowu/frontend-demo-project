import {combineReducers} from "redux";

const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        default:
            return state;
    }
};

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

const todoReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_TODO":
            return [...state, todo(null, action)];
        case "TOGGLE_TODO":
            return state.map(item => todo(item, action));
        default:
            return state;
    }
};

export default combineReducers({
    todos: todoReducer,
    counter: counterReducer
});
