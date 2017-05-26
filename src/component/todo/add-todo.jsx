import React from "react";
import PropTypes from "prop-types";

class AddTodo extends React.PureComponent {
    input = null;

    onSubmit = (event) => {
        event.preventDefault();
        if (!this.input.value.trim()) {
            return;
        }
        // addTodo(input.value);
        this.props.dispatch({
            type: "ADD_TODO",
            id: 999,
            text: this.input.value
        });
        this.input.value = "";
    };

    render() {
        return <div>
            <form onSubmit={this.onSubmit}>
                <input ref={(node) => {
                    this.input = node;
                }}/>
                <button type="submit">Add Todo</button>
            </form>
        </div>;
    }
}

AddTodo.propTypes = {
    // addTodo: PropTypes.func.isRequired,
    dispatch: PropTypes.func
};

export default AddTodo;
