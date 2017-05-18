import React from "react";
import {connect} from "react-redux";

import TodoList from "../../../component/todo/todo-list";
import AddTodo from "../../../component/todo/add-todo";

let nextTodoId = 0;

const addTodoAction = (text) => {
    nextTodoId += 1;
    return {
        type: "ADD_TODO",
        id: nextTodoId,
        text
    };
};

const toggleTodo = id => ({
    type: "TOGGLE_TODO",
    id
});

const AddTodoContainer = connect(null, {addTodo: addTodoAction})(AddTodo);
const TodoListContainer = connect(state => ({todos: state.todos}), {toggleTodo})(TodoList);

const TodoPage = () => <div>
    <AddTodoContainer/>
    <TodoListContainer/>
</div>;

export default TodoPage;
