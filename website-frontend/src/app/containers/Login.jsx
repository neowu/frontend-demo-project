import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Alert} from "antd";

class Login extends React.PureComponent {  // TODO: validation and UI lib
    username = null;
    password = null;

    onSubmit = (event) => {
        event.preventDefault();
        if (!this.username.value.trim()) {
            return;
        }
        this.props.dispatch({
            type: "LOGIN",
            username: this.username.value,
            password: this.password.value
        });
    };

    render() {
        if (this.props.loginSuccess) {
            return <Redirect to={"/"}/>;
        }

        return <div>
            {this.props.loginError ? <Alert message="Login Failed" description={this.props.loginError} type="error" closable/> : null}
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
    dispatch: PropTypes.func,
    loginSuccess: PropTypes.bool,
    loginError: PropTypes.string
};
export default connect(state => ({
    loginSuccess: state.login.success,
    loginError: state.login.error
}))(Login);
