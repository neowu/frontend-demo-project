import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import TodoList from "../../../component/todo/todo-list";

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

const AddTodo = ({addTodo}) => {
    let input = null;

    function onSubmit(event) {
        event.preventDefault();
        if (!input.value.trim()) {
            return;
        }
        addTodo(input.value);
        input.value = "";
    }

    function ref(node) {
        input = node;
    }

    return <div>
        <form onSubmit={onSubmit}>
            <input ref={ref}/>
            <button type="submit">Add Todo</button>
        </form>
    </div>;
};

AddTodo.propTypes = {addTodo: PropTypes.func.isRequired};

const AddTodoContainer = connect(null, {addTodo: addTodoAction})(AddTodo);

const mapStateToProps = state => ({todos: state.todos});

const TodoListContainer = connect(mapStateToProps, {toggleTodo})(TodoList);

const TodoPage = () => <div>
    <AddTodoContainer/>
    <TodoListContainer/>
</div>;

export default TodoPage;
