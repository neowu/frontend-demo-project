import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Login extends React.PureComponent {  // TODO: validation and UI lib
    username = null;
    password = null;

    onSubmit = (event) => {
        event.preventDefault();
        if (!this.username.value.trim()) {
            return;
        }
        // addTodo(input.value);
        this.props.dispatch({
            type: "LOGIN",
            username: this.username.value,
            password: this.password.value
        });
    };

    render() {
        return <div>
            <form onSubmit={this.onSubmit}>
                username:
                <input type="text" ref={(node) => {
                    this.username = node;
                }}/><br/>
                password:
                <input type="password" ref={(node) => {
                    this.password = node;
                }}/>
                <button type="submit">Login</button>
            </form>
        </div>;
    }
}

Login.propTypes = {
    dispatch: PropTypes.func
};
export default connect()(Login);
