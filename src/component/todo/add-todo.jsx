import React from "react";
import PropTypes from "prop-types";

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

    return <div>
        <form onSubmit={onSubmit}>
            <input ref={(node) => {
                input = node;
            }}/>
            <button type="submit">Add Todo</button>
        </form>
    </div>;
};

AddTodo.propTypes = {addTodo: PropTypes.func.isRequired};

export default AddTodo;
