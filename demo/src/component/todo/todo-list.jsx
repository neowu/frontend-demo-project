import React from "react";
import PropTypes from "prop-types";

import "./todo-list.less";

const Todo = ({onClick, completed, text}) =>
    <li onClick={onClick} style={{textDecoration: completed ? "line-through" : "none"}}>
        {text}
    </li>;

Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
};

const TodoList = ({todos, toggleTodo}) =>
    <ul className="todo">
        {todos.map(todo =>
            <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)}/>
        )}
    </ul>;

const todoType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
}).isRequired;

TodoList.propTypes = {
    todos: PropTypes.arrayOf(todoType).isRequired,
    toggleTodo: PropTypes.func.isRequired
};

export default TodoList;
